"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Activity,
  ArrowLeft,
  CirclePlus,
  Filter,
  HeartPulse,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { generatePatientId } from "@/lib/patient-id";
import { DEFAULT_PATIENT_ID, SEED_THREADS } from "@/lib/seed-threads";
import type {
  CareThread,
  CareThreadPriority,
  CareThreadStatus,
  Visit,
  VisitType,
} from "@/lib/types";

const STORAGE_KEY = "apnasehat-care-threads";
const PATIENT_KEY = "apnasehat-patient-id";

const STATUSES: CareThreadStatus[] = ["active", "monitoring", "resolved"];
const PRIORITIES: CareThreadPriority[] = ["low", "medium", "high", "urgent"];
const VISIT_TYPES: VisitType[] = [
  "consultation",
  "lab",
  "prescription",
  "follow-up",
  "imaging",
];

type DashboardUser = {
  id: string;
  firstName: string;
  fullName: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyles(status: CareThreadStatus) {
  if (status === "active") return "bg-[#e4f4ed] text-[#1f7a62]";
  if (status === "monitoring") return "bg-[#e8eefc] text-[#3d5bb5]";
  return "bg-[#eef2f0] text-[#6a7c76]";
}

function priorityStyles(priority: CareThreadPriority) {
  if (priority === "urgent") return "bg-[#fde8e8] text-[#b42318]";
  if (priority === "high") return "bg-[#fff1e6] text-[#c2410c]";
  if (priority === "medium") return "bg-[#fff8e8] text-[#a16207]";
  return "bg-[#edf5f2] text-[#4c766a]";
}

function visitDot(type: VisitType) {
  if (type === "lab") return "bg-emerald-500";
  if (type === "consultation") return "bg-blue-500";
  if (type === "prescription") return "bg-violet-500";
  if (type === "imaging") return "bg-sky-500";
  return "bg-[#2a9a76]";
}

export default function CareDashboard({ user }: { user: DashboardUser }) {
  const [threads, setThreads] = useState<CareThread[]>(SEED_THREADS);
  const [patientId, setPatientId] = useState(DEFAULT_PATIENT_ID);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CareThreadStatus>(
    "all",
  );
  const [selectedId, setSelectedId] = useState<string | null>(SEED_THREADS[0]._id);
  const [creating, setCreating] = useState(false);
  const [addingVisit, setAddingVisit] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedPatient = window.localStorage.getItem(PATIENT_KEY);
    if (storedPatient) {
      setPatientId(storedPatient);
    } else {
      window.localStorage.setItem(PATIENT_KEY, DEFAULT_PATIENT_ID);
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CareThread[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThreads(parsed);
          setSelectedId(parsed[0]._id);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, hydrated]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return threads.filter((thread) => {
      const matchesStatus =
        statusFilter === "all" || thread.status === statusFilter;
      const matchesQuery =
        !needle ||
        thread.title.toLowerCase().includes(needle) ||
        thread.condition.toLowerCase().includes(needle) ||
        thread.patientId.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [threads, query, statusFilter]);

  const selected = threads.find((thread) => thread._id === selectedId) ?? null;

  const stats = {
    total: threads.length,
    active: threads.filter((thread) => thread.status === "active").length,
    high: threads.filter(
      (thread) => thread.priority === "high" || thread.priority === "urgent",
    ).length,
    visits: threads.reduce((sum, thread) => sum + thread.visits.length, 0),
  };

  function upsertThread(next: CareThread) {
    setThreads((current) => {
      const exists = current.some((thread) => thread._id === next._id);
      if (exists) {
        return current.map((thread) => (thread._id === next._id ? next : thread));
      }
      return [next, ...current];
    });
    setSelectedId(next._id);
  }

  function addVisit(thread: CareThread, visit: Visit) {
    upsertThread({
      ...thread,
      visits: [...thread.visits, visit],
      updatedAt: new Date().toISOString(),
    });
    setAddingVisit(false);
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#123c32]">
      <nav className="sticky top-0 z-40 border-b border-[#dce9e4]/70 bg-[#f8faf8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[#123c32]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d513f] text-white shadow-lg shadow-[#0d513f]/20">
                <HeartPulse size={18} />
              </div>
              <span className="text-[19px] font-semibold tracking-[-0.03em]">
                Apna<span className="text-[#25836a]">Sehat</span>
              </span>
            </Link>
            <span className="hidden rounded-full bg-[#e4f4ed] px-3 py-1 text-[11px] font-medium text-[#27725f] sm:inline">
              Care Threads
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-[10px] uppercase tracking-wider text-[#91a29d]">
                Patient ID
              </div>
              <div className="font-mono text-sm font-semibold text-[#214e42]">
                {patientId}
              </div>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#91a29d]">
              Good {new Date().getHours() < 12 ? "morning" : "afternoon"}
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#163f35]">
              {user.firstName} 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f837c]">
              Your medical story, organized into Care Threads — one condition,
              one timeline, every visit in context.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0d513f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d513f]/20 transition hover:-translate-y-0.5 hover:bg-[#0a4436]"
          >
            <CirclePlus size={18} />
            New Care Thread
          </button>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Threads", stats.total, <Stethoscope key="i1" size={16} />],
            ["Active", stats.active, <Activity key="i2" size={16} />],
            ["Needs attention", stats.high, <Filter key="i3" size={16} />],
            ["Visits", stats.visits, <Sparkles key="i4" size={16} />],
          ].map(([label, value, icon]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-[#e3ebe8] bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f5ef] text-[#24765f]">
                {icon}
              </div>
              <div className="text-xs text-[#8b9d98]">{label}</div>
              <div className="mt-1 text-2xl font-semibold text-[#214d41]">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ca09a]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, condition, or patient ID"
              className="w-full rounded-2xl border border-[#e1ebe7] bg-white py-3 pl-10 pr-4 text-sm outline-none ring-[#0d513f]/20 placeholder:text-[#9aaaa5] focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", ...STATUSES] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-2 text-xs font-semibold capitalize ${
                  statusFilter === status
                    ? "bg-[#0d513f] text-white"
                    : "border border-[#dce9e4] bg-white text-[#557069]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#cfe0da] bg-white p-10 text-center text-sm text-[#7c8e89]">
                No Care Threads match this view. Create one to start a health
                story.
              </div>
            ) : (
              filtered.map((thread) => (
                <button
                  key={thread._id}
                  type="button"
                  onClick={() => setSelectedId(thread._id)}
                  className={`w-full rounded-[24px] border p-5 text-left transition ${
                    selectedId === thread._id
                      ? "border-[#0d513f] bg-white shadow-[0_16px_40px_rgba(18,60,50,0.08)]"
                      : "border-[#e1ebe7] bg-white hover:border-[#cbded7]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9aaaa5]">
                        {thread.patientId} · {thread.visits.length} visits
                      </div>
                      <h2 className="mt-1 text-lg font-semibold text-[#244e43]">
                        {thread.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#71847e]">
                        {thread.condition}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusStyles(thread.status)}`}
                      >
                        {thread.status}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${priorityStyles(thread.priority)}`}
                      >
                        {thread.priority}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#7c8e89]">
                    {thread.description}
                  </p>
                  <div className="mt-4 text-[10px] text-[#9aaaa5]">
                    Updated {formatDate(thread.updatedAt)}
                  </div>
                </button>
              ))
            )}
          </section>

          <section className="rounded-[28px] border border-[#e1ebe7] bg-white p-6 shadow-[0_20px_70px_rgba(18,60,50,0.06)] sm:p-7">
            {!selected ? (
              <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-[#7c8e89]">
                Select a Care Thread to see its visit timeline.
              </div>
            ) : (
              <ThreadDetail
                thread={selected}
                addingVisit={addingVisit}
                onAddVisit={() => setAddingVisit(true)}
                onCancelVisit={() => setAddingVisit(false)}
                onSaveVisit={(visit) => addVisit(selected, visit)}
                onStatusChange={(status) =>
                  upsertThread({
                    ...selected,
                    status,
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
            )}
          </section>
        </div>
      </div>

      {creating ? (
        <NewThreadModal
          patientId={patientId}
          createdBy={user.id}
          onClose={() => setCreating(false)}
          onCreate={(thread) => {
            upsertThread(thread);
            setCreating(false);
          }}
          onRegeneratePatient={() => {
            const next = generatePatientId();
            setPatientId(next);
            window.localStorage.setItem(PATIENT_KEY, next);
          }}
        />
      ) : null}
    </main>
  );
}

function ThreadDetail({
  thread,
  addingVisit,
  onAddVisit,
  onCancelVisit,
  onSaveVisit,
  onStatusChange,
}: {
  thread: CareThread;
  addingVisit: boolean;
  onAddVisit: () => void;
  onCancelVisit: () => void;
  onSaveVisit: (visit: Visit) => void;
  onStatusChange: (status: CareThreadStatus) => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94a59f]">
            Care Thread
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-[#244e43]">
            {thread.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6f837c]">
            {thread.description}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4f4ed] text-[#28765f]">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-xs sm:grid-cols-2">
        <Meta label="Patient ID" value={thread.patientId} mono />
        <Meta label="Created by" value={thread.createdBy} />
        <Meta label="Condition" value={thread.condition} />
        <Meta label="Opened" value={formatDate(thread.createdAt)} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize ${
              thread.status === status
                ? statusStyles(status) + " ring-1 ring-black/5"
                : "bg-[#f4f7f6] text-[#6a7c76]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#244e43]">Visits</h3>
        <button
          type="button"
          onClick={onAddVisit}
          className="text-xs font-semibold text-[#25836a]"
        >
          Add visit
        </button>
      </div>

      {addingVisit ? (
        <VisitForm onCancel={onCancelVisit} onSave={onSaveVisit} />
      ) : null}

      <div className="relative mt-5 space-y-4">
        <div className="absolute bottom-6 left-[13px] top-6 w-px bg-[#d6e5df]" />
        {thread.visits.length === 0 ? (
          <p className="text-sm text-[#7c8e89]">No visits recorded yet.</p>
        ) : (
          thread.visits.map((visit) => (
            <div key={visit._id} className="relative flex items-start gap-4">
              <div
                className={`relative z-10 mt-2 h-7 w-7 rounded-full border-4 border-white ${visitDot(visit.type)}`}
              />
              <div className="flex-1 rounded-xl border border-[#e6eeeb] bg-[#fbfcfc] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-[#9aaaa5]">
                      {formatDate(visit.date)} · {visit.type}
                    </div>
                    <div className="mt-1 text-sm font-medium text-[#264e43]">
                      {visit.title}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#71847e]">
                  {visit.notes}
                </p>
                {visit.location ? (
                  <div className="mt-2 text-[10px] text-[#8a9b96]">
                    {visit.location}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[#f7faf9] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#9aaaa5]">
        {label}
      </div>
      <div className={`mt-1 text-[#31584d] ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function NewThreadModal({
  patientId,
  createdBy,
  onClose,
  onCreate,
  onRegeneratePatient,
}: {
  patientId: string;
  createdBy: string;
  onClose: () => void;
  onCreate: (thread: CareThread) => void;
  onRegeneratePatient: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState<CareThreadStatus>("active");
  const [priority, setPriority] = useState<CareThreadPriority>("medium");

  function submit(event: FormEvent) {
    event.preventDefault();
    const now = new Date().toISOString();
    onCreate({
      _id: crypto.randomUUID(),
      patientId,
      createdBy,
      title: title.trim(),
      description: description.trim(),
      condition: condition.trim(),
      status,
      priority,
      createdAt: now,
      updatedAt: now,
      visits: [],
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#123c32]/30 p-4 sm:items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#244e43]">
            New Care Thread
          </h2>
          <button type="button" onClick={onClose} className="text-[#7c8e89]">
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#f7faf9] px-4 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#9aaaa5]">
              Patient ID
            </div>
            <div className="font-mono text-sm font-semibold">{patientId}</div>
          </div>
          <button
            type="button"
            onClick={onRegeneratePatient}
            className="text-xs font-semibold text-[#25836a]"
          >
            Generate new
          </button>
        </div>

        <label className="mb-3 block text-xs font-semibold text-[#557069]">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#e1ebe7] px-3 py-2.5 text-sm text-[#123c32] outline-none focus:ring-2 focus:ring-[#0d513f]/20"
            placeholder="Respiratory Health"
          />
        </label>
        <label className="mb-3 block text-xs font-semibold text-[#557069]">
          Condition
          <input
            required
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#e1ebe7] px-3 py-2.5 text-sm text-[#123c32] outline-none focus:ring-2 focus:ring-[#0d513f]/20"
            placeholder="Hypertension"
          />
        </label>
        <label className="mb-3 block text-xs font-semibold text-[#557069]">
          Description
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-[#e1ebe7] px-3 py-2.5 text-sm text-[#123c32] outline-none focus:ring-2 focus:ring-[#0d513f]/20"
            placeholder="Why this thread exists, and what you are tracking."
          />
        </label>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-[#557069]">
            Status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as CareThreadStatus)
              }
              className="mt-1 w-full rounded-xl border border-[#e1ebe7] bg-white px-3 py-2.5 text-sm"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#557069]">
            Priority
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as CareThreadPriority)
              }
              className="mt-1 w-full rounded-xl border border-[#e1ebe7] bg-white px-3 py-2.5 text-sm"
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[#0d513f] py-3 text-sm font-semibold text-white"
        >
          Create thread
        </button>
      </form>
    </div>
  );
}

function VisitForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (visit: Visit) => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<VisitType>("consultation");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      _id: crypto.randomUUID(),
      date,
      type,
      title: title.trim(),
      notes: notes.trim(),
      location: location.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 space-y-3 rounded-2xl border border-[#dce9e4] bg-[#f7faf9] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Visit title"
          className="rounded-xl border border-[#e1ebe7] bg-white px-3 py-2 text-sm"
        />
        <input
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-xl border border-[#e1ebe7] bg-white px-3 py-2 text-sm"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as VisitType)}
          className="rounded-xl border border-[#e1ebe7] bg-white px-3 py-2 text-sm"
        >
          {VISIT_TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Hospital or clinic"
          className="rounded-xl border border-[#e1ebe7] bg-white px-3 py-2 text-sm"
        />
      </div>
      <textarea
        required
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="What happened in this visit?"
        rows={2}
        className="w-full rounded-xl border border-[#e1ebe7] bg-white px-3 py-2 text-sm"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-1.5 text-xs text-[#6a7c76]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#0d513f] px-4 py-1.5 text-xs font-semibold text-white"
        >
          Save visit
        </button>
      </div>
    </form>
  );
}
