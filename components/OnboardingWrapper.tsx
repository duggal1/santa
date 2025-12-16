"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import OnboardingChat from "./OnboardingChat";

interface OnboardingWrapperProps {
  userId: string;
}

export default function OnboardingWrapper({ userId }: OnboardingWrapperProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnboardingComplete = async (data: { displayName: string; referralSource: string }) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      toast.success("Welcome to Christmas AI!");
      router.refresh(); // Refresh to show dashboard
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <OnboardingChat
      onComplete={handleOnboardingComplete}
      isLoading={isLoading}
    />
  );
}
