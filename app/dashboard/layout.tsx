import { auth, currentUser } from "@clerk/nextjs/server";
import DashboardShell from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  const user = await currentUser();

  return (
    <DashboardShell
      user={{
        fullName: user?.fullName ?? user?.firstName ?? "Patient",
        imageUrl: user?.imageUrl,
      }}
    >
      {children}
    </DashboardShell>
  );
}
