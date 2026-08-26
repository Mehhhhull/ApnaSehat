import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import CareDashboard from "./care-dashboard";

export const metadata: Metadata = {
  title: "Care Threads — ApnaSehat",
  description: "Your medical history, organized into Care Threads.",
};

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();

  return (
    <CareDashboard
      user={{
        id: user?.id ?? "unknown",
        firstName: user?.firstName ?? "there",
        fullName: user?.fullName ?? "ApnaSehat member",
      }}
    />
  );
}
