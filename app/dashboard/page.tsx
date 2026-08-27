import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import CareDashboard from "./care-dashboard";
import connect from "@/lib/database";
import User from "@/models/user.models";

export const metadata: Metadata = {
  title: "Care Threads — ApnaSehat",
  description: "Your medical history, organized into Care Threads.",
};

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  await connect();
  await User.findOneAndUpdate(
    { clerkId: user.id },
    {
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      username: user.username ?? undefined,
      photo: user.imageUrl,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

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
