import type { Metadata } from "next";
import ComingSoon from "../coming-soon";

export const metadata: Metadata = {
  title: "Timeline — ApnaSehat",
};

export default function TimelinePage() {
  return (
    <ComingSoon
      kicker="Health history"
      title="Timeline"
      description="Every consultation, report and prescription in one chronological record."
    />
  );
}
