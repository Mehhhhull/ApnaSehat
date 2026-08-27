"use client";

import { ArrowUp, Bot, MessageCircle, Plus, Sparkles, User } from "lucide-react";
import { useState } from "react";

type Message = { role: "user" | "assistant"; text: string; recordsUsed?: number };

const suggestions = [
  "Summarize my recent health activity",
  "What should I ask at my next visit?",
  "Help me understand my Care Threads",
];

function sanitizeAssistantText(text: string) {
  return text
    .replace(/<br\s*\/?>(?=\S)/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?\s*$/gm, "")
    .replace(/^\s*\|\s*(.+?)\s*\|?\s*$/gm, (_, row: string) => {
      const cells = row.split("|").map((cell) => cell.trim()).filter(Boolean);
      return cells.length > 1 ? `• ${cells.join(" — ")}` : row.trim();
    })
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function AskChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text = draft) {
    const question = text.trim();
    if (!question || loading) return;
    setMessages((current) => [...current, { role: "user", text: question }]);
    setDraft("");
    setLoading(true);
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", text: response.ok && typeof data.answer === "string" ? data.answer : (data.error ?? "I could not answer that right now."), recordsUsed: response.ok ? data.recordsUsed : undefined }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "I could not connect to the health assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col bg-[#f7faf8]">
      <header className="border-b border-[#e2ebe7] bg-white px-5 py-5 lg:px-10"><div className="mx-auto flex max-w-4xl items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163c34] text-white"><Sparkles size={19} /></div><div><h1 className="text-lg font-semibold text-[#163c34]">Ask ApnaSehat</h1><p className="text-xs text-[#7b8f87]">Your health history, in conversation</p></div></div><button type="button" onClick={() => setMessages([])} className="flex items-center gap-2 rounded-lg border border-[#dce9e4] px-3 py-2 text-sm font-medium text-[#49665c] transition hover:bg-[#f1f7f4]"><Plus size={16} />New chat</button></div></header>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 lg:px-10"><div className="flex-1 py-8">{messages.length === 0 ? <div className="mx-auto flex min-h-[52vh] max-w-2xl flex-col items-center justify-center text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dceee6] text-[#2f7a62]"><Bot size={30} strokeWidth={1.7} /></div><h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#163c34]">How can I help today?</h2><p className="mt-3 max-w-md text-[15px] leading-6 text-[#71857d]">Ask questions about your care journey, visits, medications, or anything you want to prepare for.</p><div className="mt-8 grid w-full gap-3 text-left sm:grid-cols-3">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void sendMessage(suggestion)} className="rounded-xl border border-[#dce9e4] bg-white p-4 text-sm leading-5 text-[#35574c] shadow-sm transition hover:-translate-y-0.5 hover:border-[#a9cdbd] hover:shadow-md">{suggestion}<span className="mt-3 block text-[#83a99a]">↗</span></button>)}</div></div> : <div className="mx-auto max-w-3xl space-y-8">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`flex max-w-[min(680px,88%)] gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message.role === "user" ? "bg-[#d8e9e2] text-[#2f7a62]" : "bg-[#163c34] text-white"}`}>{message.role === "user" ? <User size={16} /> : <Bot size={16} />}</div><div><div className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-6 ${message.role === "user" ? "rounded-tr-sm bg-[#dceee6] text-[#163c34]" : "rounded-tl-sm border border-[#e1ebe7] bg-white text-[#456359] shadow-sm"}`}>{message.role === "assistant" ? sanitizeAssistantText(message.text) : message.text}</div>{message.role === "assistant" && message.recordsUsed !== undefined ? <p className="mt-1 text-[11px] text-[#91a49d]">Generated from {message.recordsUsed} relevant health record{message.recordsUsed === 1 ? "" : "s"}</p> : null}</div></div></div>)}{loading ? <div className="flex items-center gap-3 text-sm text-[#71857d]"><Bot size={17} />Searching your health records...</div> : null}</div>}</div><div className="sticky bottom-0 bg-[#f7faf8] pb-5 pt-3"><div className="rounded-2xl border border-[#cddfd7] bg-white p-2 shadow-[0_8px_30px_rgba(28,71,57,0.08)] focus-within:border-[#74aa94] focus-within:ring-4 focus-within:ring-[#74aa94]/10"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Message ApnaSehat..." rows={2} className="w-full resize-none bg-transparent px-3 py-2 text-[15px] text-[#163c34] outline-none placeholder:text-[#9aada5]" /><div className="flex items-center justify-between px-2 pb-1"><span className="flex items-center gap-1.5 text-xs text-[#93a79f]"><MessageCircle size={14} />Health assistant</span><button type="button" aria-label="Send message" onClick={() => void sendMessage()} disabled={!draft.trim() || loading} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2f7a62] text-white transition hover:bg-[#255f4d] disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp size={18} /></button></div></div><p className="mt-3 text-center text-[11px] text-[#91a49d]">ApnaSehat can make mistakes. Always confirm medical decisions with a qualified professional.</p></div></div>
    </main>
  );
}
