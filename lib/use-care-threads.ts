"use client";

import { useCallback, useEffect, useState } from "react";
import { generatePatientId } from "@/lib/patient-id";
import { DEFAULT_PATIENT_ID, SEED_THREADS } from "@/lib/seed-threads";
import type { CareThread, Visit } from "@/lib/types";

const PATIENT_KEY = "apnasehat-patient-id";

export function useCareThreads() {
  const [threads, setThreads] = useState<CareThread[]>(SEED_THREADS);
  const [patientId, setPatientId] = useState(() =>
    typeof window === "undefined"
      ? DEFAULT_PATIENT_ID
      : window.localStorage.getItem(PATIENT_KEY) ?? DEFAULT_PATIENT_ID,
  );
  const [hydrated] = useState(true);

  useEffect(() => {
    const storedPatient = window.localStorage.getItem(PATIENT_KEY);
    if (!storedPatient) {
      window.localStorage.setItem(PATIENT_KEY, DEFAULT_PATIENT_ID);
    }
  }, []);

  const upsertThread = useCallback((next: CareThread) => {
    setThreads((current) => {
      const exists = current.some((thread) => thread._id === next._id);
      if (exists) {
        return current.map((thread) => (thread._id === next._id ? next : thread));
      }
      return [next, ...current];
    });
  }, []);

  const addVisit = useCallback(
    (thread: CareThread, visit: Visit) => {
      upsertThread({
        ...thread,
        visits: [...thread.visits, visit],
        updatedAt: new Date().toISOString(),
      });
    },
    [upsertThread],
  );

  const regeneratePatientId = useCallback(() => {
    const next = generatePatientId();
    setPatientId(next);
    window.localStorage.setItem(PATIENT_KEY, next);
    return next;
  }, []);

  return {
    threads,
    patientId,
    hydrated,
    upsertThread,
    addVisit,
    regeneratePatientId,
  };
}
