import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { saveUser } from "@/app/actions/user.actions";
import CareDashboard from "./care-dashboard";

export const metadata: Metadata = {
  title: "Care Threads — ApnaSehat",
  description: "Your medical history, organized into Care Threads.",
};

export default async function DashboardPage() {
  const user = await currentUser();
  await saveUser();

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
