import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CareThreadModel } from "@/lib/models/care-thread";
import type { CareThread, Visit } from "@/lib/types";

export const runtime = "nodejs";

function termsFrom(question: string) {
  return question.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
}

function scoreThread(thread: CareThread, terms: string[]) {
  const text = [
    thread.title,
    thread.description,
    thread.condition,
    thread.status,
    thread.priority,
    ...thread.visits.flatMap((visit) => [visit.title, visit.notes, visit.type, visit.location ?? ""]),
  ].join(" ").toLowerCase();
  return terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
}

function formatVisit(visit: Visit) {
  return [
    `  Entry: ${visit.title}`,
    `  Date: ${visit.date}`,
    `  Type: ${visit.type}`,
    `  Notes: ${visit.notes}`,
    visit.location ? `  Location: ${visit.location}` : "",
  ].filter(Boolean).join("\n");
}

function formatContext(threads: CareThread[]) {
  return threads.map((thread) => [
    `THREAD: ${thread.title}`,
    `Condition: ${thread.condition}`,
    `Status: ${thread.status}`,
    `Priority: ${thread.priority}`,
    `Description: ${thread.description}`,
    thread.visits.map(formatVisit).join("\n"),
  ].join("\n")).join("\n\n---\n\n");
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > 2000) {
    return NextResponse.json({ error: "Please provide a question up to 2000 characters." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The AI service is not configured. Add GROQ_API_KEY to .env.local." }, { status: 503 });
  }

  try {
    await connectToDatabase();
    const records = await CareThreadModel.find({
      $or: [{ createdBy: userId }, { createdBy: "system" }],
    }).lean<CareThread[]>();

    const terms = termsFrom(question);
    const relevant = records
      .map((thread) => ({ thread, score: scoreThread(thread, terms) }))
      .sort((left, right) => right.score - left.score || right.thread.updatedAt.localeCompare(left.thread.updatedAt))
      .slice(0, 6)
      .map(({ thread }) => thread);
    const context = formatContext(relevant);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
        temperature: 0.1,
        messages: [
          { role: "system", content: "You are ApnaSehat, a careful India-focused health-record assistant. Answer using only the PATIENT RECORDS block. If the answer is not present, say that the records do not contain that information. Do not guess, diagnose, invent facts, or use outside medical knowledge. Mention the relevant record date when available. Keep answers concise and remind the user to consult a qualified professional for medical decisions. If the user expresses suicidal thoughts, self-harm intent, or immediate danger, respond empathetically and prioritize immediate safety: ask them to call India's emergency number 112 or go to the nearest emergency department, and provide India's Tele-MANAS mental-health helpline 14416 or 1-800-891-4416. Do not mention U.S. numbers such as 911 or 988 unless the user explicitly says they are in the United States. Do not provide location-specific numbers for any other country unless the user gives that location." },
          { role: "user", content: `PATIENT RECORDS:\n${context || "No matching patient records were found."}\n\nQUESTION:\n${question}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null) as { error?: { message?: string } } | null;
      const providerMessage = errorBody?.error?.message;
      console.error("LLM request failed", response.status, providerMessage ?? "Unknown Groq error");
      return NextResponse.json(
        { error: providerMessage ? `Groq: ${providerMessage}` : "The AI service could not answer right now." },
        { status: 502 },
      );
    }

    const result = await response.json();
    const answer = result.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json({ error: "The AI service returned an empty answer." }, { status: 502 });
    }

    return NextResponse.json({ answer: answer.trim(), recordsUsed: relevant.length });
  } catch (error) {
    console.error("Ask RAG request failed", error);
    return NextResponse.json({ error: "Could not retrieve patient records." }, { status: 500 });
  }
}