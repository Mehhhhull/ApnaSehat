export type EmergencyAudit = {
  at: string;
  type: string;
  status: "Allowed" | "Denied";
};

export const EMERGENCY_PROFILE = {
  token: "PAT-7K2M9A",
  bloodGroup: "B positive",
  allergies: "Penicillin",
  conditions: "Type 2 diabetes · Hypertension",
  confirmedOn: "18 Jun 2025",
};

export const EMERGENCY_AUDIT: EmergencyAudit[] = [
  {
    at: "17 Jun 2025 · 21:14",
    type: "Profile preview",
    status: "Allowed",
  },
  {
    at: "16 Jun 2025 · 08:02",
    type: "Profile preview",
    status: "Allowed",
  },
  {
    at: "09 Jun 2025 · 19:41",
    type: "Profile preview",
    status: "Allowed",
  },
];
