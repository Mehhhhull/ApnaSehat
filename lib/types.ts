export type VisitType =
  | "consultation"
  | "lab"
  | "prescription"
  | "follow-up"
  | "imaging";

export type CareThreadStatus = "active" | "monitoring" | "resolved";

export type CareThreadPriority = "low" | "medium" | "high" | "urgent";

export type Visit = {
  _id: string;
  date: string;
  type: VisitType;
  title: string;
  notes: string;
  location?: string;
};

export type CareThread = {
  _id: string;
  patientId: string;
  createdBy: string;
  title: string;
  description: string;
  condition: string;
  status: CareThreadStatus;
  priority: CareThreadPriority;
  createdAt: string;
  updatedAt: string;
  visits: Visit[];
};
