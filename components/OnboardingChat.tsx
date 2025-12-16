"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ios-spinner";
import { cn } from "@/lib/utils";
import {
  UserIcon,
  Search01Icon,
NewTwitterRectangleIcon,
  UserMultiple02Icon,
  AdvertisimentIcon,
  News01Icon,
  More01Icon,
  CheckmarkCircle01Icon,
} from "hugeicons-react";

// --- TYPES ---
type OnboardingStep = "ENTRY" | "NAME" | "REFERRAL" | "COMPLETE";

const REFERRAL_OPTIONS = [
  { label: "Google Search", icon: Search01Icon },
  { label: "Social Media", icon: NewTwitterRectangleIcon },
  { label: "Friend/Family", icon: UserMultiple02Icon },
  { label: "Advertisement", icon: AdvertisimentIcon },
  { label: "News Article", icon: News01Icon },
  { label: "Other", icon: More01Icon },
];

interface OnboardingProps {
  onComplete: (data: { displayName: string; referralSource: string }) => void;
  isLoading?: boolean;
}

// --- CUSTOM COMPONENTS ---

const PrettyButton = ({
  children,
  className,
  onClick,
  disabled,
  icon: Icon
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ElementType;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      `relative w-full inline-flex items-center justify-center gap-3
      h-12 sm:h-13 px-8 sm:px-10 text-lg rounded-full font-medium  sm:text-lg whitespace-nowrap
      text-white bg-[#ff5151] border border-[#cf4f4f]
      shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]
      transition-all duration-200 ease-out
      overflow-hidden isolate cursor-pointer group
      before:absolute before:inset-0 before:rounded-full
      before:bg-linear-to-b before:from-white/35 before:to-transparent before:opacity-40
      before:transition-all before:duration-200

      hover:bg-[#ff3434]
      hover:before:opacity-65
      hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.55)]
      hover:-translate-y-0.5

      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-[#e03636]/60

      active:scale-[0.98]
      active:translate-y-0
      disabled:pointer-events-none disabled:opacity-50 disabled:grayscale`,
      className
    )}
  >
    {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />}
    {children}
  </button>
);

// --- SCREEN COMPONENTS ---

const EntryScreen = ({ setStep }: { setStep: (step: OnboardingStep) => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, filter: "blur(10px)" }}
    className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-md mx-auto px-4"
  >
    <div className="space-y-8 mb-16">
     

      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-stone-900 leading-tight">
          Welcome to your<br/>
          <span className="text-stone-400">Christmas AI</span>
        </h1>

      </div>

      <div className="pt-8">
        <PrettyButton
          onClick={() => setStep("NAME")}
          icon={UserIcon}
        >
          Let's get started
        </PrettyButton>
      </div>
    </div>
  </motion.div>
);

const NameScreen = ({
  displayName,
  setDisplayName,
  setStep
}: {
  displayName: string;
  setDisplayName: (name: string) => void;
  setStep: (step: OnboardingStep) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-md mx-auto space-y-12 py-20 pb-40 px-4"
  >
    <div className="space-y-8">
      <div className="flex items-center justify-start">
        <Button
          onClick={() => setStep("ENTRY")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100 -ml-3"
        >
          ←
        </Button>
      </div>

      <div className="space-y-6">
       

        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-medium text-stone-900">What's your name?</h2>
     
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
        
          <Input
            placeholder="Sarah Johnson"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-14 rounded-2xl bg-white border-stone-200 text-lg font-medium px-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
          />
          <p className="text-stone-500 text-sm ml-1 leading-relaxed">
            We'll use this to make things feel more personal
          </p>
        </div>

        <div className="pt-8 flex justify-end">
          <PrettyButton
            onClick={() => setStep("REFERRAL")}
            disabled={!displayName.trim()}
           
          >
            Continue
          </PrettyButton>
        </div>
      </div>
    </div>
  </motion.div>
);

const ReferralScreen = ({
  displayName,
  referralSource,
  setReferralSource,
  onComplete,
  isLoading,
  setStep
}: {
  displayName: string;
  referralSource: string;
  setReferralSource: (source: string) => void;
  onComplete: (data: { displayName: string; referralSource: string }) => void;
  isLoading: boolean;
  setStep: (step: OnboardingStep) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-md mx-auto space-y-12 py-20 pb-40 px-4"
  >
    <div className="space-y-8">
      <div className="flex items-center justify-start">
        <Button
          onClick={() => setStep("NAME")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100 -ml-3"
        >
          ←
        </Button>
      </div>

      <div className="space-y-6">
       

        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-medium text-stone-900">How did you find us?</h2>
        
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-stone-900 font-medium text-base block text-left ml-1">
            Where did you hear about Christmas AI?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {REFERRAL_OPTIONS.map((option) => (
              <button
                key={option.label}
                onClick={() => setReferralSource(option.label)}
                className={cn(
                  "p-4 rounded-2xl border text-center font-medium transition-all text-sm",
                  referralSource === option.label
                    ? "bg-stone-800 text-stone-50 border-stone-900 shadow-lg"
                    : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-stone-500 text-sm ml-1 leading-relaxed">
            Feel free to choose "Other" if none of these fit
          </p>
        </div>

        <div className="pt-8 flex justify-end">
          <PrettyButton
            onClick={() => onComplete({ displayName, referralSource })}
            disabled={!referralSource || isLoading}
           
          >
            {isLoading ? (
              <>
                <Spinner size={16} color="#ffffff" />
                Setting up...
              </>
            ) : (
              "Complete setup"
            )}
          </PrettyButton>
        </div>
      </div>
    </div>
  </motion.div>
);

const CompletionScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-md mx-auto px-4"
  >
    <div className="space-y-8">
      <div className="flex justify-center">
        <Spinner size={48} color="#ff5151" />
      </div>

      <div className="space-y-4">
        <p className="text-stone-600 font-medium text-lg leading-relaxed">
          Just redirecting you to your personalized Christmas AI experience...
        </p>
      </div>
    </div>
  </motion.div>
);

// --- MAIN COMPONENT ---
export default function Onboarding({ onComplete, isLoading = false }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>("ENTRY");
  const [displayName, setDisplayName] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const handleComplete = (data: { displayName: string; referralSource: string }) => {
    setStep("COMPLETE");
    setTimeout(() => {
      onComplete(data);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <AnimatePresence mode="wait">
          {step === "ENTRY" && <EntryScreen key="entry" setStep={setStep} />}
          {step === "NAME" && (
            <NameScreen
              key="name"
              displayName={displayName}
              setDisplayName={setDisplayName}
              setStep={setStep}
            />
          )}
          {step === "REFERRAL" && (
            <ReferralScreen
              key="referral"
              displayName={displayName}
              referralSource={referralSource}
              setReferralSource={setReferralSource}
              onComplete={handleComplete}
              isLoading={isLoading}
              setStep={setStep}
            />
          )}
          {step === "COMPLETE" && <CompletionScreen key="complete" />}
        </AnimatePresence>
      </div>
    </main>
  );
}
