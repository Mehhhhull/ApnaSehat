import type { Metadata } from "next";
import { DashboardMain, PageHeader } from "../page-header";
import EmergencyQrForm from "./emergency-qr-form";

export const metadata: Metadata = {
  title: "Emergency QR — ApnaSehat",
};

export default function EmergencyQrPage() {
  return (
    <DashboardMain>
      <PageHeader
        kicker="Emergency access"
        title="Emergency QR identity."
        description="Share critical facts safely when every second matters."
      />
      <EmergencyQrForm />
    </DashboardMain>
  );
}
