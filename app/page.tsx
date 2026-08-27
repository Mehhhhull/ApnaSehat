"use client";

import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const timeline = [
  {
    date: "24 AUG 2026",
    title: "Blood Test",
    hospital: "Apollo Hospitals",
    type: "Lab Report",
    color: "bg-emerald-500",
  },
  {
    date: "12 AUG 2026",
    title: "Cardiology Consultation",
    hospital: "Fortis Healthcare",
    type: "Consultation",
    color: "bg-blue-500",
  },
  {
    date: "03 JUL 2026",
    title: "Prescription Updated",
    hospital: "Dr. Sharma Clinic",
    type: "Prescription",
    color: "bg-violet-500",
  },
];

const features = [
  {
    number: "01",
    title: "One Health Timeline",
    description:
      "Every consultation, prescription, report and diagnosis organized into one intelligent medical history.",
  },
  {
    number: "02",
    title: "AI Care Threads",
    description:
      "AI connects scattered medical records and turns them into understandable health stories.",
  },
  {
    number: "03",
    title: "Your Data. Your Control.",
    description:
      "Keep your health records private, encrypted and completely under your control.",
  },
];

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z" />
      <path d="m19 16-.6 2.4L16 19l2.4.6L19 22l.6-2.4L19 16Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 20 6v5c0 5.2-3.4 8.7-8 10-4.6-1.3-8-4.8-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8faf8] text-[#123c32]">
    
     

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#dce9e4]/70 bg-[#f8faf8]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d513f] text-white shadow-lg shadow-[#0d513f]/20">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21s-8-4.8-8-11a4.8 4.8 0 0 1 8-3.5A4.8 4.8 0 0 1 20 10c0 6.2-8 11-8 11Z" />
                <path d="M12 8v5M9.5 10.5h5" />
              </svg>
            </div>

            <span className="text-[19px] font-semibold tracking-[-0.03em]">
              Apna<span className="text-[#25836a]">Sehat</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-9 text-sm text-[#557069] md:flex">
            <a
              href="#timeline"
              className="transition hover:text-[#0d513f]"
            >
              Timeline
            </a>

            <a
              href="#ai"
              className="transition hover:text-[#0d513f]"
            >
              AI Care
            </a>

            <a
              href="#security"
              className="transition hover:text-[#0d513f]"
            >
              Security
            </a>

            <a
              href="#about"
              className="transition hover:text-[#0d513f]"
            >
              About
            </a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-5 md:flex">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="text-sm font-medium text-[#557069] transition hover:text-[#0d513f]">
                    Login
                  </button>
                </SignInButton>

                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="rounded-full bg-[#0d513f] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#0d513f]/20 transition hover:-translate-y-0.5 hover:bg-[#0a4436]">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5e4df] md:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-px w-5 bg-[#123c32]" />
              <span className="block h-px w-5 bg-[#123c32]" />
              <span className="block h-px w-5 bg-[#123c32]" />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="border-t border-[#dce9e4] bg-[#f8faf8] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-5 text-sm text-[#557069]">
              <a href="#timeline">Timeline</a>
              <a href="#ai">AI Care</a>
              <a href="#security">Security</a>
              <a href="#about">About</a>

              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="text-left">
                      Login
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="rounded-full bg-[#0d513f] px-5 py-3 text-center font-medium text-white">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div className="flex items-center gap-3 border-t border-[#dce9e4] pt-5">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />

                  <span className="text-sm font-medium text-[#31584d]">
                    Account
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>


      <section className="relative px-5 pb-20 pt-36 lg:px-8 lg:pb-28 lg:pt-44">
        <div className="pointer-events-none absolute left-[-180px] top-24 h-[500px] w-[500px] rounded-full bg-[#d7f1e9] opacity-60 blur-3xl" />

        <div className="pointer-events-none absolute right-[-180px] top-40 h-[450px] w-[450px] rounded-full bg-[#e4f4ed] opacity-70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Hero Content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cce5dc] bg-white px-4 py-2 text-xs font-medium text-[#27725f] shadow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#21a779]" />
              Your health. One intelligent memory.
            </div>

            <h1 className="max-w-[650px] text-[46px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#103e33] sm:text-6xl lg:text-[72px]">
              Your health,
              <br />
              <span className="text-[#25836a]">
                never forgotten.
              </span>
            </h1>

            <p className="mt-7 max-w-[560px] text-[17px] leading-8 text-[#657a74]">
              ApnaSehat brings your medical records, prescriptions,
              reports and consultations into one intelligent health
              timeline — powered by AI.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {!isSignedIn ? (
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="group flex items-center justify-center gap-3 rounded-full bg-[#0d513f] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-[#0d513f]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#093e31]">
                    Start Your Health Memory

                    <span className="transition group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </button>
                </SignUpButton>
              ) : (
                <a
                  href="/dashboard"
                  className="group flex items-center justify-center gap-3 rounded-full bg-[#0d513f] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-[#0d513f]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#093e31]"
                >
                  Open Your Health Memory

                  <span className="transition group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </a>
              )}

              <button
                onClick={() =>
                  document
                    .getElementById("timeline")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="rounded-full border border-[#d5e4df] bg-white px-7 py-4 text-sm font-semibold text-[#214e42] transition hover:border-[#a9c9be] hover:bg-[#f5faf8]"
              >
                See How It Works
              </button>
            </div>

            {/* Trust */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["A", "R", "S", "K"].map((letter) => (
                  <div
                    key={letter}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f8faf8] bg-[#d9ebe4] text-[10px] font-semibold text-[#236452]"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <div className="text-xs text-[#71847e]">
                <div className="mb-0.5 font-semibold text-[#365a50]">
                  Built for real people
                </div>

                Securely managing health memories
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#cdece0] blur-3xl" />

            <div className="relative rounded-[28px] border border-white bg-white p-3 shadow-[0_30px_100px_rgba(18,60,50,0.13)]">
              {/* Browser Header */}
              <div className="flex items-center justify-between rounded-t-[20px] border-b border-[#edf2f0] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#dce8e4]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#dce8e4]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#dce8e4]" />
                </div>

                <div className="text-[10px] font-medium text-[#8ca09a]">
                  app.apnasehat.com
                </div>

                <div className="h-5 w-5" />
              </div>

              {/* Dashboard */}
              <div className="rounded-b-[20px] bg-[#f7faf9] p-5 sm:p-7">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#91a29d]">
                      Good morning
                    </div>

                    <div className="mt-1 text-xl font-semibold text-[#163f35]">
                      Rahul 👋
                    </div>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9eee6] text-sm font-semibold text-[#28705e]">
                    RK
                  </div>
                </div>

                {/* Health Score */}
                <div className="mb-4 rounded-2xl bg-[#0d513f] p-5 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-[#b9d8ce]">
                        Health overview
                      </div>

                      <div className="mt-2 text-2xl font-semibold">
                        Looking good
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                      <span className="text-sm font-semibold">
                        87%
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-[87%] rounded-full bg-[#70d9b6]" />
                  </div>
                </div>

                
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#e3ebe8] bg-white p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f5ef] text-[#24765f]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 19V5M4 19h16" />
                        <path d="m7 15 3-4 3 2 5-7" />
                      </svg>
                    </div>

                    <div className="text-xs text-[#8b9d98]">
                      Records
                    </div>

                    <div className="mt-1 text-lg font-semibold text-[#214d41]">
                      42
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e3ebe8] bg-white p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#eeeafd] text-[#6c58ba]">
                      <SparkleIcon />
                    </div>

                    <div className="text-xs text-[#8b9d98]">
                      AI insights
                    </div>

                    <div className="mt-1 text-lg font-semibold text-[#214d41]">
                      08
                    </div>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="mt-3 rounded-2xl border border-[#dfeae6] bg-white p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e4f4ed] text-[#24765f]">
                      <SparkleIcon />
                    </div>

                    <span className="text-xs font-semibold text-[#31594e]">
                      AI Health Insight
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#71847e]">
                    Your recent reports show improved blood pressure
                    compared with your previous two visits.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Security Card */}
            <div className="absolute -bottom-7 -left-5 hidden w-56 rounded-2xl border border-[#e0ebe7] bg-white p-4 shadow-[0_20px_60px_rgba(18,60,50,0.12)] sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f5ef] text-[#27755f]">
                  <ShieldIcon />
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-[#31584d]">
                    Data protected
                  </div>

                  <div className="mt-0.5 text-[10px] text-[#899b96]">
                    End-to-end encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="border-y border-[#e2ebe7] bg-white/60 px-5 py-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-medium uppercase tracking-[0.14em] text-[#8da09a]">
          <span>Private by design</span>

          <span className="hidden h-1 w-1 rounded-full bg-[#c7d8d2] sm:block" />

          <span>AI assisted</span>

          <span className="hidden h-1 w-1 rounded-full bg-[#c7d8d2] sm:block" />

          <span>Patient owned</span>

          <span className="hidden h-1 w-1 rounded-full bg-[#c7d8d2] sm:block" />

          <span>Built for India</span>
        </div>
      </section>



      <section
        id="timeline"
        className="px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-[#e4f4ed] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#29735e]">
              One place. Everything.
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#123f34] sm:text-5xl">
              The health timeline
              <br />
              you should have always had.
            </h2>

            <p className="mt-5 text-[16px] leading-7 text-[#70827d]">
              Stop digging through WhatsApp messages, PDFs, emails and
              old files. Your entire medical journey finally lives in
              one place.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Timeline Card */}
            <div className="rounded-[28px] border border-[#e1ebe7] bg-white p-6 shadow-[0_20px_70px_rgba(18,60,50,0.06)] sm:p-8">
              <div className="flex items-center justify-between border-b border-[#edf2f0] pb-5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9aaaa5]">
                    Medical history
                  </div>

                  <div className="mt-1 text-lg font-semibold text-[#244e43]">
                    Rahul&apos;s health journey
                  </div>
                </div>

                <div className="rounded-xl bg-[#f1f7f4] px-3 py-2 text-xs font-medium text-[#43806e]">
                  42 records
                </div>
              </div>

              <div className="relative mt-8">
                <div className="absolute bottom-5 left-[11px] top-5 w-px bg-[#dce9e4]" />

                <div className="space-y-7">
                  {timeline.map((item) => (
                    <div
                      key={item.title}
                      className="relative flex gap-5"
                    >
                      <div
                        className={`relative z-10 mt-1 h-[23px] w-[23px] shrink-0 rounded-full border-4 border-white ${item.color} shadow-sm`}
                      />

                      <div className="flex-1 rounded-2xl border border-[#e9efed] bg-[#fbfcfc] p-4 transition hover:border-[#cbded7] hover:shadow-sm">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row">
                          <div>
                            <div className="text-sm font-semibold text-[#264e43]">
                              {item.title}
                            </div>

                            <div className="mt-1 text-xs text-[#7c8e89]">
                              {item.hospital}
                            </div>
                          </div>

                          <div className="text-[9px] font-semibold tracking-wider text-[#9aaaa5]">
                            {item.date}
                          </div>
                        </div>

                        <div className="mt-3 inline-flex rounded-full bg-[#edf5f2] px-2.5 py-1 text-[9px] font-medium text-[#4c766a]">
                          {item.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] bg-[#0d513f] p-7 text-white shadow-xl shadow-[#0d513f]/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3v18M3 12h18" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                </div>

                <h3 className="mt-7 text-xl font-semibold">
                  Auto-Sync
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#b9d8ce]">
                  Connect authorized healthcare providers and
                  automatically bring new records into your timeline.
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-medium text-[#8fe0c2]">
                  Explore connections
                  <ArrowIcon />
                </div>
              </div>

              <div className="rounded-[28px] border border-[#e1ebe7] bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f7f5] text-[#315f53]">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="6" />
                    <path d="m16 16 5 5" />
                  </svg>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-[#244e43]">
                  Global Search
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#7b8d88]">
                  Find a prescription, test result or diagnosis in
                  seconds — even across years of records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="ai"
        className="relative overflow-hidden bg-[#edf5f1] px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#c9e8dc] opacity-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#29735e] shadow-sm">
              <SparkleIcon />
              AI Health Intelligence
            </span>

            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-[#123f34] sm:text-5xl">
              Your records tell a story.
              <br />
              <span className="text-[#298068]">
                AI helps you see it.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-[16px] leading-8 text-[#6f837c]">
              Medical information is fragmented by default. ApnaSehat
              uses AI to connect related events, identify patterns and
              organize them into understandable{" "}
              <strong className="font-semibold text-[#41675c]">
                Care Threads.
              </strong>
            </p>

            <div className="mt-9 space-y-5">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="flex gap-5 rounded-2xl border border-white/70 bg-white/60 p-5 backdrop-blur-sm transition hover:bg-white"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcefe8] text-xs font-bold text-[#28745f]">
                    {feature.number}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#244e43]">
                      {feature.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-[#71847e]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Visualization */}
          <div className="relative">
            <div className="rounded-[30px] border border-white bg-white p-4 shadow-[0_30px_100px_rgba(18,60,50,0.10)]">
              <div className="rounded-[24px] bg-[#f8faf9] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94a59f]">
                      AI Care Thread
                    </div>

                    <div className="mt-2 text-xl font-semibold text-[#244e43]">
                      Respiratory Health
                    </div>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4f4ed] text-[#28765f]">
                    <SparkleIcon />
                  </div>
                </div>

                <div className="relative mt-8 space-y-4">
                  <div className="absolute bottom-6 left-[14px] top-6 w-px bg-[#d6e5df]" />

                  {[
                    ["May 2025", "Persistent cough reported"],
                    ["Jun 2025", "Chest X-ray completed"],
                    ["Aug 2025", "Treatment prescribed"],
                    ["Aug 2026", "Symptoms improving"],
                  ].map(([date, text], index) => (
                    <div
                      key={date}
                      className="relative flex items-center gap-4"
                    >
                      <div
                        className={`relative z-10 h-7 w-7 rounded-full border-4 border-[#f8faf9] ${
                          index === 3
                            ? "bg-[#2a9a76]"
                            : "bg-[#b7d5ca]"
                        }`}
                      />

                      <div className="flex-1 rounded-xl border border-[#e6eeeb] bg-white px-4 py-3">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[#9aaaa5]">
                          {date}
                        </div>

                        <div className="mt-1 text-xs font-medium text-[#49685f]">
                          {text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                <div className="mt-7 rounded-2xl bg-[#0d513f] p-5 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <SparkleIcon />
                    AI Summary
                  </div>

                  <p className="mt-3 text-xs leading-6 text-[#c3ded5]">
                    Your respiratory symptoms have improved over the
                    last 12 months, with no recent indicators requiring
                    urgent attention.
                  </p>

                  <button className="mt-4 text-[10px] font-semibold text-[#83d9bb]">
                    View source records →
                  </button>
                </div>
              </div>
            </div>

            {/* AI Badge */}
            <div className="absolute -right-5 -top-5 rounded-2xl border border-[#dbe9e4] bg-white px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e4f4ed] text-[#29765f]">
                  <SparkleIcon />
                </span>

                <div>
                  <div className="text-[10px] font-semibold text-[#31584d]">
                    AI analyzed
                  </div>

                  <div className="text-[9px] text-[#8a9b96]">
                    42 records
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      <section
        id="security"
        className="px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-[#e9f2ef] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#29735e]">
              Privacy first
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-[#123f34] sm:text-5xl">
              A vault for something
              <br />
              that actually matters.
            </h2>

            <p className="mt-5 text-[16px] leading-7 text-[#748680]">
              Your health data isn&apos;t an advertising product.
              It belongs to you.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: <LockIcon />,
                title: "Encrypted",
                text: "Your sensitive health information is protected in transit and at rest.",
              },
              {
                icon: <ShieldIcon />,
                title: "Patient Owned",
                text: "You decide who can access your records and what they can see.",
              },
              {
                icon: <ShieldIcon />,
                title: "Privacy First",
                text: "Designed around healthcare privacy instead of retrofitting it later.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[26px] border border-[#e1ebe7] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#123f34]/5"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf6f2] text-[#26735e]">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#264e43]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#778984]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="px-5 pb-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[30px] bg-[#0d513f] sm:grid-cols-3">
          {[
            ["10×", "faster record retrieval"],
            ["1", "unified health timeline"],
            ["24/7", "access to your history"],
          ].map(([number, label], index) => (
            <div
              key={number}
              className={`px-8 py-10 text-center ${
                index !== 2
                  ? "border-b border-white/10 sm:border-b-0 sm:border-r"
                  : ""
              }`}
            >
              <div className="text-4xl font-semibold tracking-[-0.04em] text-white">
                {number}
              </div>

              <div className="mt-2 text-sm text-[#afd2c5]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="bg-[#f0f6f3] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-5xl font-serif text-[#b7d7cc]">
            “
          </div>

          <blockquote className="mt-2 text-2xl font-medium leading-relaxed tracking-[-0.02em] text-[#285348] sm:text-3xl">
            I used to carry a folder full of medical reports whenever
            I travelled. Now my entire health history is in my pocket.
          </blockquote>

          <div className="mt-8">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#d7ebe3] text-xs font-bold text-[#337461]">
              SM
            </div>

            <div className="mt-3 text-sm font-semibold text-[#365b50]">
              Sarah M.
            </div>

            <div className="mt-1 text-xs text-[#82928d]">
              ApnaSehat early user
            </div>
          </div>
        </div>
      </section>


      <section className="px-5 py-24 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#0d513f] px-7 py-16 text-center shadow-[0_30px_90px_rgba(13,81,63,0.20)] sm:px-12">
          <div className="absolute left-1/2 top-[-180px] h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#2a8b70] opacity-30 blur-3xl" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-[#b9d9ce]">
              Your health deserves better.
            </span>

            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Take control of your health memory.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#b7d5cb]">
              Start building a complete, intelligent and private record
              of your health — before you need it.
            </p>

            {!isSignedIn ? (
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#174d3e] shadow-xl transition hover:-translate-y-1">
                  Create Your Health Memory

                  <span className="transition group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </button>
              </SignUpButton>
            ) : (
              <a
                href="/dashboard"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#174d3e] shadow-xl transition hover:-translate-y-1"
              >
                Open Your Health Memory

                <span className="transition group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </a>
            )}
          </div>
        </div>
      </section>


      <footer
        id="about"
        className="border-t border-[#dfe9e5] bg-[#f8faf8] px-5 py-10 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d513f] text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 21s-8-4.8-8-11a4.8 4.8 0 0 1 8-3.5A4.8 4.8 0 0 1 20 10c0 6.2-8 11-8 11Z" />
                  <path d="M12 8v5M9.5 10.5h5" />
                </svg>
              </div>

              <span className="font-semibold text-[#234d42]">
                ApnaSehat
              </span>
            </div>

            <p className="mt-3 text-xs text-[#8a9b96]">
              Your health. Your memory. Your control.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#788b85]">
            <a href="#" className="hover:text-[#245b4d]">
              Privacy
            </a>

            <a href="#" className="hover:text-[#245b4d]">
              Terms
            </a>

            <a
              href="#security"
              className="hover:text-[#245b4d]"
            >
              Security
            </a>

            <a href="#" className="hover:text-[#245b4d]">
              Contact
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#e4ece9] pt-6 text-[10px] text-[#9aaaa5]">
          © 2026 ApnaSehat. Built for a healthier, more connected India.
        </div>
      </footer>
    </main>
  );
}