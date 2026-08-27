import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CareThreadModel } from "@/lib/models/care-thread";
import { SEED_THREADS } from "@/lib/seed-threads";
import type { CareThread } from "@/lib/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const existing = await CareThreadModel.find({
      $or: [{ createdBy: userId }, { createdBy: "system" }],
    })
      .sort({ updatedAt: -1 })
      .lean<CareThread[]>();

    if (existing.length === 0) {
      await CareThreadModel.bulkWrite(
        SEED_THREADS.map((thread) => ({
          updateOne: {
            filter: { _id: thread._id },
            update: { $setOnInsert: thread },
            upsert: true,
          },
        })),
      );
      return NextResponse.json(SEED_THREADS);
    }

    return NextResponse.json(existing);
  } catch (error) {
    console.error("Failed to load care threads", error);
    return NextResponse.json(
      { error: "Failed to load care threads" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thread = (await request.json()) as CareThread;
    if (!thread?._id || !thread.title) {
      return NextResponse.json({ error: "Invalid care thread" }, { status: 400 });
    }

    await connectToDatabase();
    const saved = await CareThreadModel.findOneAndUpdate(
      { _id: thread._id, $or: [{ createdBy: userId }, { createdBy: "system" }] },
      { $set: { ...thread, createdBy: userId } },
      { new: true, upsert: true, runValidators: true, lean: true },
    );

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to save care thread", error);
    return NextResponse.json(
      { error: "Failed to save care thread" },
      { status: 500 },
    );
  }
}
