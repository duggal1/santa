import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, referralSource } = await request.json();

    if (!displayName || !referralSource) {
      return NextResponse.json(
        { error: "Display name and referral source are required" },
        { status: 400 }
      );
    }

    // Update the user with onboarding data
    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        displayName,
        referralSource,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
      create: {
        id: userId,
        displayName,
        referralSource,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
