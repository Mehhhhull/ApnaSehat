"use server";

import { currentUser } from "@clerk/nextjs/server";
import connect from "@/lib/db";
import User from "@/models/user.models";

export async function saveUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const email = clerkUser.primaryEmailAddress?.emailAddress;

  if (!email) {
    throw new Error("The Clerk user has no primary email address");
  }

  await connect();

  await User.findOneAndUpdate(
    { clerkId: clerkUser.id },
    {
      clerkId: clerkUser.id,
      email,
      username: clerkUser.username ?? undefined,
      photo: clerkUser.imageUrl,
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}
