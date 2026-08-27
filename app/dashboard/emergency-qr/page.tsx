import type { Metadata } from "next";
import ComingSoon from "../coming-soon";

export const metadata: Metadata = {
  title: "Emergency QR — ApnaSehat",
};

export default function EmergencyQrPage() {
  return (
    <ComingSoon
      kicker="Emergency access"
      title="Emergency QR identity."
      description="Share critical facts safely when every second matters."
    />
  );
}
