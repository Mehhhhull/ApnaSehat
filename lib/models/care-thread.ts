import mongoose, { Schema } from "mongoose";
import type { CareThread } from "@/lib/types";

const visitSchema = new Schema(
  {
    _id: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    notes: { type: String, required: true },
    location: { type: String },
  },
  { _id: false },
);

const careThreadSchema = new Schema<CareThread>(
  {
    _id: { type: String, required: true },
    patientId: { type: String, required: true, index: true },
    createdBy: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    condition: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true, index: true },
    visits: { type: [visitSchema], default: [] },
  },
  { collection: "careThreads", versionKey: false },
);

export const CareThreadModel =
  (mongoose.models.CareThread as mongoose.Model<CareThread> | undefined) ??
  mongoose.model<CareThread>("CareThread", careThreadSchema);
