import type { Metadata } from "next";
import ComingSoon from "../coming-soon";

export const metadata: Metadata = {
  title: "AI Summary — ApnaSehat",
};

export default function AiSummaryPage() {
  return (
    <ComingSoon
      kicker="Health intelligence"
      title="AI Summary"
      description="A readable story of your Care Threads, patterns and what needs attention."
    />
  );
}
