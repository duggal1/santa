import { ensureUser } from "@/lib/ensure-user";
import DashboardClient from "@/components/DashboardClient";
import OnboardingWrapper from "@/components/OnboardingWrapper";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null; // This shouldn't happen due to ensureUser, but just in case
  }

  await ensureUser();

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompleted: true },
  });

  if (!user?.onboardingCompleted) {
    // Show onboarding
    return <OnboardingWrapper userId={userId} />;
  }

  // Show dashboard
  return <DashboardClient />;
}
