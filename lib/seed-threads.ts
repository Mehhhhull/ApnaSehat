import type { CareThread } from "./types";

export const DEFAULT_PATIENT_ID = "PAT-7K2M9A";

export const SEED_THREADS: CareThread[] = [
  {
    _id: "ct_resp_01",
    patientId: DEFAULT_PATIENT_ID,
    createdBy: "system",
    title: "Respiratory Health",
    description:
      "Persistent cough that began in May 2025, followed by imaging, treatment, and a steady recovery over the next year.",
    condition: "Lower respiratory tract infection",
    status: "monitoring",
    priority: "medium",
    createdAt: "2025-05-12T09:10:00.000Z",
    updatedAt: "2026-08-18T11:20:00.000Z",
    visits: [
      {
        _id: "v_resp_1",
        date: "2025-05-12",
        type: "consultation",
        title: "Persistent cough reported",
        notes: "Dry cough for 11 days. No fever. Mild chest tightness after walking.",
        location: "Dr. Sharma Clinic",
      },
      {
        _id: "v_resp_2",
        date: "2025-06-03",
        type: "imaging",
        title: "Chest X-ray completed",
        notes: "Mild bronchial markings. No consolidation. Follow-up advised.",
        location: "Apollo Hospitals",
      },
      {
        _id: "v_resp_3",
        date: "2025-08-14",
        type: "prescription",
        title: "Treatment prescribed",
        notes: "Inhaled bronchodilator for 4 weeks plus steam inhalation.",
        location: "Dr. Sharma Clinic",
      },
      {
        _id: "v_resp_4",
        date: "2026-08-18",
        type: "follow-up",
        title: "Symptoms improving",
        notes: "Cough largely resolved. Continue monitoring during monsoon season.",
        location: "Apollo Hospitals",
      },
    ],
  },
  {
    _id: "ct_cardio_01",
    patientId: DEFAULT_PATIENT_ID,
    createdBy: "system",
    title: "Cardiology Follow-up",
    description:
      "Blood pressure and cholesterol tracking after a cardiology consult at Fortis. Recent reports show improvement versus the last two visits.",
    condition: "Hypertension / lipid management",
    status: "active",
    priority: "high",
    createdAt: "2026-04-02T08:00:00.000Z",
    updatedAt: "2026-08-12T16:40:00.000Z",
    visits: [
      {
        _id: "v_cardio_1",
        date: "2026-04-02",
        type: "consultation",
        title: "Cardiology consultation",
        notes: "BP 148/92. Family history of CAD. Lifestyle changes and labs ordered.",
        location: "Fortis Healthcare",
      },
      {
        _id: "v_cardio_2",
        date: "2026-06-21",
        type: "lab",
        title: "Lipid panel",
        notes: "LDL 142 mg/dL. Triglycerides 178 mg/dL. Statin discussed.",
        location: "Fortis Healthcare",
      },
      {
        _id: "v_cardio_3",
        date: "2026-08-12",
        type: "follow-up",
        title: "Blood pressure improved",
        notes: "Home readings averaging 132/84. Continue diet, walking, and medication.",
        location: "Fortis Healthcare",
      },
    ],
  },
  {
    _id: "ct_labs_01",
    patientId: DEFAULT_PATIENT_ID,
    createdBy: "system",
    title: "Annual Blood Work",
    description:
      "Routine metabolic and complete blood count tracking for the yearly health review.",
    condition: "Preventive screening",
    status: "resolved",
    priority: "low",
    createdAt: "2026-08-24T07:30:00.000Z",
    updatedAt: "2026-08-24T07:30:00.000Z",
    visits: [
      {
        _id: "v_labs_1",
        date: "2026-08-24",
        type: "lab",
        title: "Blood test",
        notes: "CBC and metabolic panel within expected range. Vitamin D slightly low.",
        location: "Apollo Hospitals",
      },
    ],
  },
  {
    _id: "ct_metab_01",
    patientId: DEFAULT_PATIENT_ID,
    createdBy: "system",
    title: "Vitamin D Correction",
    description:
      "Opened from the latest blood work. Supplement plan and a 12-week recheck.",
    condition: "Vitamin D deficiency",
    status: "active",
    priority: "medium",
    createdAt: "2026-08-24T10:15:00.000Z",
    updatedAt: "2026-08-25T09:00:00.000Z",
    visits: [
      {
        _id: "v_metab_1",
        date: "2026-08-25",
        type: "prescription",
        title: "Supplement started",
        notes: "Cholecalciferol weekly for 8 weeks, then maintenance dose.",
        location: "Dr. Sharma Clinic",
      },
    ],
  },
];
