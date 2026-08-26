import type { Metadata } from "next";
import ComingSoon from "../coming-soon";

export const metadata: Metadata = {
  title: "Ask ApnaSehat",
};

export default function AskPage() {
  return (
    <ComingSoon
      kicker="Assistant"
      title="Ask ApnaSehat"
      description="Ask about your timeline, Care Threads and recent visits in plain language."
    />
  );
}
