import { prisma } from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function ensureUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (existingUser) {
    return existingUser;
  }

  // Fetch from Clerk
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
    },
  });

  return newUser;
}
