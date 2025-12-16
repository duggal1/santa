"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHatIcon,
  CursorMagicSelection01Icon,
  ZapIcon,
  ArrowLeft01Icon as ArrowLeft,
  AllBookmarkIcon as Save,
  Share01Icon as Share2,
  Clock01Icon,
  ShoppingBag02Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ios-spinner";
import { cn } from "@/lib/utils";

// --- TYPES ---
type DinnerResult = {
  summary: string;
  menu: {
    main: string;
    side: string;
    comfort: string;
    finish: string;
  };
  prep: {
    earlier: string[];
    dayOf: string[];
  };
  shopping: {
    produce: string[];
    pantry: string[];
    protein: string[];
    niceToHave: string[];
  };
  skip: string;
  close: string;
};

type ViewState = "ENTRY" | "WHO" | "ENERGY" | "TIME_SPACE" | "REALITY" | "THINKING" | "RESULTS";

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
      `relative inline-flex items-center justify-center gap-3
      h-12 sm:h-14 px-8 sm:px-10 rounded-full font-medium text-base sm:text-lg whitespace-nowrap
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

const SelectionCard = ({
  title,
  subtitle,
  onClick,
  selected
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  selected?: boolean;
}) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "group relative flex-1 flex flex-col items-center justify-center p-6 md:p-8",
      "rounded-3xl border transition-all duration-300 text-center space-y-3 h-full w-full",
      selected
        ? "bg-stone-800 border-stone-800 text-stone-50 shadow-2xl shadow-stone-900/20"
        : "bg-stone-50 border-stone-100/50 text-stone-600 hover:bg-white hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/40"
    )}
  >
    <h3 className={cn(
      "text-lg font-medium",
      selected ? "text-stone-50" : "text-stone-900"
    )}>{title}</h3>
    <p className={cn(
      "text-sm font-medium",
      selected ? "text-stone-300" : "text-stone-500"
    )}>{subtitle}</p>
  </motion.button>
);

const CustomCheckbox = ({ 
  id, 
  checked, 
  onCheckedChange 
}: { 
  id: string, 
  checked: boolean, 
  onCheckedChange: (c: boolean) => void 
}) => (
  <Checkbox
    id={id}
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={cn(
      "h-6 w-6 rounded-md border-stone-300 transition-all duration-200",
      "data-[state=checked]:bg-stone-800 data-[state=checked]:text-stone-50 data-[state=checked]:border-stone-800",
      "focus-visible:ring-stone-400"
    )}
  />
);

// --- SCREEN COMPONENTS ---

interface ScreenProps {
  setView: (view: ViewState) => void;
  adults: string;
  setAdults: (value: string) => void;
  kids: string;
  setKids: (value: string) => void;
  mixedPrefs: boolean;
  setMixedPrefs: (value: boolean) => void;
  energyLevel: string;
  setEnergyLevel: (value: string) => void;
  timeAvailable: string;
  setTimeAvailable: (value: string) => void;
  kitchenSetup: string;
  setKitchenSetup: (value: string) => void;
  restrictions: string[];
  setRestrictions: (value: string[]) => void;
  additionalNotes: string;
  setAdditionalNotes: (value: string) => void;
  handleSubmit: () => void;
  result: DinnerResult | null;
  reset: () => void;
  pauseText: string;
}

const EntryScreen = ({ setView }: { setView: (view: ViewState) => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, filter: "blur(10px)" }}
    className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto"
  >
    <div className="space-y-6 mb-12">
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-stone-900 leading-[1.1]">
        Plan a Calm <br/>
        <span className="text-stone-400">Christmas Dinner</span>
      </h1>
      <p className="text-stone-600 font-medium text-lg">
        Your space, your people, your energy.
      </p>
    </div>

    <PrettyButton
      onClick={() => setView("WHO")}
      icon={ChefHatIcon}
    >
      Start Planning
    </PrettyButton>
  </motion.div>
);

const WhoScreen = ({
  setView,
  adults,
  setAdults,
  kids,
  setKids,
  mixedPrefs,
  setMixedPrefs,
}: Pick<ScreenProps, 'setView' | 'adults' | 'setAdults' | 'kids' | 'setKids' | 'mixedPrefs' | 'setMixedPrefs'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-xl mx-auto space-y-8 py-10 pb-32"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("ENTRY")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-14 h-14 p-4 hover:bg-stone-100"
      >
        <ArrowLeft className="w-6 h-6 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">Who will be at the table?</h2>
    </div>

    <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-stone-900 font-medium text-base ml-2">Adults</Label>
          <Input
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="How many adults?"
            className="h-16 rounded-2xl bg-stone-50 border-stone-200 text-lg font-medium px-6 focus:bg-white focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-stone-900 font-medium text-base ml-2">Kids</Label>
          <Input
            type="number"
            min="0"
            value={kids}
            onChange={(e) => setKids(e.target.value)}
            placeholder="Any kids joining?"
            className="h-16 rounded-2xl bg-stone-50 border-stone-200 text-lg font-medium px-6 focus:bg-white focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
          />
        </div>

        <div className="flex items-center space-x-4 pt-2 ml-2">
          <CustomCheckbox
            id="mixedPrefs"
            checked={mixedPrefs}
            onCheckedChange={(c) => setMixedPrefs(c)}
          />
          <Label htmlFor="mixedPrefs" className="text-stone-700 font-medium text-base cursor-pointer select-none">
            Different tastes or picky eaters
          </Label>
        </div>
        <p className="text-stone-500 text-sm ml-2">A rough idea is perfectly fine.</p>
      </div>
    </div>

    <div className="flex justify-end">
      <PrettyButton
        onClick={() => setView("ENERGY")}
        disabled={!adults.trim()}
        icon={CursorMagicSelection01Icon}
      >
        Next Step
      </PrettyButton>
    </div>
  </motion.div>
);

const EnergyScreen = ({
  setView,
  energyLevel,
  setEnergyLevel,
}: Pick<ScreenProps, 'setView' | 'energyLevel' | 'setEnergyLevel'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-4xl mx-auto space-y-8 py-10 pb-32"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("WHO")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-12 h-12 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">How do you want this to feel?</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-64">
      <SelectionCard
        title="Nice and easy"
        subtitle="Nothing complicated"
        onClick={() => setEnergyLevel("Nice and easy")}
        selected={energyLevel === "Nice and easy"}
      />
      <SelectionCard
        title="Some effort"
        subtitle="A bit of cooking, still relaxed"
        onClick={() => setEnergyLevel("Some effort")}
        selected={energyLevel === "Some effort"}
      />
      <SelectionCard
        title="I enjoy cooking"
        subtitle="Happy to spend time on it"
        onClick={() => setEnergyLevel("I enjoy cooking")}
        selected={energyLevel === "I enjoy cooking"}
      />
    </div>

    <div className="flex justify-end pt-8">
      <PrettyButton
        onClick={() => setView("TIME_SPACE")}
        disabled={!energyLevel}
        icon={CursorMagicSelection01Icon}
      >
        Next Step
      </PrettyButton>
    </div>
  </motion.div>
);

const TimeSpaceScreen = ({
  setView,
  timeAvailable,
  setTimeAvailable,
  kitchenSetup,
  setKitchenSetup,
}: Pick<ScreenProps, 'setView' | 'timeAvailable' | 'setTimeAvailable' | 'kitchenSetup' | 'setKitchenSetup'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-4xl mx-auto space-y-12 py-10 pb-32"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("ENERGY")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-12 h-12 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">What does your day look like?</h2>
    </div>

    <div className="space-y-10">
      <div className="space-y-4">
        <Label className="text-stone-400 font-medium text-sm uppercase tracking-widest ml-1">How much time do you have?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SelectionCard
            title="Less than an hour"
            subtitle="Quick and simple"
            onClick={() => setTimeAvailable("Less than 1 hour")}
            selected={timeAvailable === "Less than 1 hour"}
          />
          <SelectionCard
            title="About 1–2 hours"
            subtitle="Some cooking time"
            onClick={() => setTimeAvailable("1–2 hours")}
            selected={timeAvailable === "1–2 hours"}
          />
          <SelectionCard
            title="Most of the day"
            subtitle="No rush"
            onClick={() => setTimeAvailable("Half day")}
            selected={timeAvailable === "Half day"}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-stone-400 font-medium text-sm uppercase tracking-widest ml-1">What's your kitchen like?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SelectionCard
            title="Very basic"
            subtitle="Limited space or tools"
            onClick={() => setKitchenSetup("Small / basic")}
            selected={kitchenSetup === "Small / basic"}
          />
          <SelectionCard
            title="Pretty normal"
            subtitle="Standard home kitchen"
            onClick={() => setKitchenSetup("Normal")}
            selected={kitchenSetup === "Normal"}
          />
          <SelectionCard
            title="Well equipped"
            subtitle="Most tools available"
            onClick={() => setKitchenSetup("Fully equipped")}
            selected={kitchenSetup === "Fully equipped"}
          />
        </div>
      </div>
    </div>

    <div className="flex justify-end pt-4">
      <PrettyButton
        onClick={() => setView("REALITY")}
        disabled={!timeAvailable || !kitchenSetup}
        icon={CursorMagicSelection01Icon}
      >
        Next Step
      </PrettyButton>
    </div>
  </motion.div>
);

const RealityScreen = ({
  setView,
  restrictions,
  setRestrictions,
  additionalNotes,
  setAdditionalNotes,
  handleSubmit
}: Pick<ScreenProps, 'setView' | 'restrictions' | 'setRestrictions' | 'additionalNotes' | 'setAdditionalNotes' | 'handleSubmit'>) => {
  const toggleRestriction = (restriction: string) => {
    setRestrictions(
      restrictions.includes(restriction)
        ? restrictions.filter(r => r !== restriction)
        : [...restrictions, restriction]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto space-y-8 py-10 pb-32"
    >
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setView("TIME_SPACE")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 hover:bg-stone-100"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
        </Button>
        <h2 className="text-2xl font-medium text-stone-900">Final Details</h2>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
        <div className="space-y-4">
          <Label className="text-stone-900 font-medium text-base ml-1">Anything we should keep in mind?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Vegetarian", "No alcohol", "No oven", "Budget-conscious", "Nothing fancy", "Gluten-free"].map((restriction) => (
              <div key={restriction} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                <CustomCheckbox
                  id={restriction}
                  checked={restrictions.includes(restriction)}
                  onCheckedChange={() => toggleRestriction(restriction)}
                />
                <Label htmlFor={restriction} className="text-stone-700 font-medium text-base cursor-pointer w-full select-none">
                  {restriction}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-stone-900 font-medium text-base ml-1">Anything you already know?</Label>
          <Textarea
            placeholder="For example: dislikes, favorites, things you want to avoid..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="min-h-[120px] rounded-2xl bg-stone-50 border-stone-200 text-base font-medium p-6 focus:bg-white focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 resize-none transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <PrettyButton
          onClick={handleSubmit}
          icon={ZapIcon}
        >
          Show me the plan
        </PrettyButton>
      </div>
    </motion.div>
  );
};

const ThinkingScreen = ({ pauseText }: Pick<ScreenProps, 'pauseText'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-[70vh] w-full space-y-8"
  >
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Menu Card Skeleton */}
      <div className="bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-sm border border-stone-200/50 p-12 md:p-20">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="relative text-center space-y-12">
          <Skeleton className="h-4 w-20 bg-stone-200 rounded mx-auto" />
          <div className="space-y-8">
            <div>
              <Skeleton className="h-4 w-16 bg-stone-200 rounded mx-auto mb-2" />
              <Skeleton className="h-8 w-48 bg-stone-200 rounded-lg mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-4 w-12 bg-stone-200 rounded mx-auto mb-2" />
                <Skeleton className="h-6 w-32 bg-stone-100 rounded mx-auto" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 bg-stone-200 rounded mx-auto mb-2" />
                <Skeleton className="h-6 w-40 bg-stone-100 rounded mx-auto" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-20 bg-stone-200 rounded mx-auto mb-2" />
              <Skeleton className="h-6 w-36 bg-stone-100 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Spinner size={40} color="#ff5151" />
      </div>
    </div>

    <div className="h-20 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={pauseText}
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
          className="text-stone-900 text-xl font-medium tracking-tight text-center"
        >
          {pauseText}
        </motion.p>
      </AnimatePresence>
    </div>
  </motion.div>
);

const ResultsScreen = ({ setView, result, reset }: Pick<ScreenProps, 'setView' | 'result' | 'reset'>) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto py-12 pb-48"
    >
      {/* 0. NAVIGATION (Minimal Text Only) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-20 px-2"
      >
        <button
          onClick={() => setView("REALITY")}
          className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium tracking-wide">Refine details</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/50 border border-stone-200/50 backdrop-blur-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-[#ff5151]" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">Itinerary</span>
        </div>
      </motion.div>

      <div className="space-y-24">

        {/* 1. THE SUMMARY (Editorial Hero) */}
        <div className="text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-5xl font-medium font-sans text-stone-900 leading-[1.15] mb-8 tracking-tight"
          >
            {result.summary}
          </motion.h1>
         
 </div>
        {/* 2. THE MENU (Physical Paper Artifact) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto max-w-3xl perspective-1000"
        >
          {/* The Card */}
          <div className="relative bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03),0_30px_60px_-10px_rgba(28,25,23,0.12)]">

            {/* Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Content */}
            <div className="relative p-12 md:p-20 text-center">
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-12">
                Dinner Menu
              </span>

              <div className="space-y-12">
                <div>
                  <h3 className="text-sm font-medium text-stone-500 mb-2 italic font-serif">Main</h3>
                  <p className="text-2xl md:text-3xl text-stone-900 font-medium tracking-tight">{result.menu.main}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                   {/* Divider for desktop */}
                   <div className="hidden md:block absolute left-1/2 top-2 bottom-2 w-px bg-stone-200" />

                   <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-2 italic font-serif">Side</h3>
                      <p className="text-xl text-stone-800">{result.menu.side}</p>
                   </div>
                   <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-2 italic font-serif">Comfort</h3>
                      <p className="text-xl text-stone-800">{result.menu.comfort}</p>
                   </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-stone-500 mb-2 italic font-serif">To Finish</h3>
                  <p className="text-xl text-stone-800">{result.menu.finish}</p>
                </div>
              </div>

              {/* Bottom Stamp */}
              <div className="mt-16 flex justify-center opacity-40">
                <ChefHatIcon className="w-6 h-6 text-stone-900" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. THE FLOW (Asymmetrical Editorial Layout) */}
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 md:sticky md:top-12">
             <h3 className="text-3xl font-serif text-stone-900 mb-4">The Flow</h3>
             <p className="text-stone-500 leading-relaxed text-sm">
               A paced timeline to ensure you aren't rushing. Follow the rhythm, not the clock.
             </p>
          </div>

          <div className="md:col-span-8 space-y-16">
            {/* Phase 1 */}
            <div className="relative pl-8 border-l border-stone-200">
               <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-white" />
               <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Ahead of Time</h4>
               <ul className="space-y-6">
                 {result.prep.earlier.map((item, i) => (
                   <li key={i} className="group">
                     <p className="text-lg text-stone-800 leading-relaxed group-hover:text-stone-900 transition-colors">
                       {item}
                     </p>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 border-l border-[#ff5151]">
               <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#ff5151] ring-4 ring-white shadow-lg shadow-red-500/20" />
               <h4 className="text-sm font-bold text-[#ff5151] uppercase tracking-widest mb-6">On The Day</h4>
               <ul className="space-y-6">
                 {result.prep.dayOf.map((item, i) => (
                   <li key={i} className="group">
                     <p className="text-xl font-medium text-stone-900 leading-relaxed">
                       {item}
                     </p>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>

        {/* 4. PROVISIONS (High Contrast Dark Block) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1c1917] rounded-3xl p-10 md:p-16 text-stone-200 shadow-2xl"
        >
          <div className="flex items-baseline justify-between mb-12 border-b border-stone-800 pb-8">
            <h3 className="text-3xl font-serif text-white">Provisions</h3>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest hidden sm:block">Shopping List</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
             {[
               { title: "Produce", items: result.shopping.produce },
               { title: "Protein", items: result.shopping.protein },
               { title: "Pantry", items: result.shopping.pantry },
               { title: "Nice to Have", items: result.shopping.niceToHave }
             ].map((cat, idx) => (
               <div key={idx} className="space-y-6">
                  <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em]">{cat.title}</h4>
                  <ul className="space-y-3">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-medium text-stone-300">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-stone-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
             ))}
          </div>
        </motion.div>

        {/* 5. FOOTER (Minimal) */}
        <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-stone-100">
           <div>
              <h4 className="text-xs font-bold text-[#ff5151] uppercase tracking-widest mb-3">Permission to Ignore</h4>
              <p className="text-xl font-serif text-stone-900 italic">
                "{result.skip}"
              </p>
           </div>
           <div className="md:text-right">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Note</h4>
              <p className="text-stone-500">
                {result.close}
              </p>
           </div>
        </div>

      </div>

      {/* FLOATING ACTION DOCK (Clean, Rounded, Shadowed) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 pl-4 rounded-full bg-white/80 backdrop-blur-xl border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50">
        <div className="flex items-center gap-1 pr-4 border-r border-stone-200">
          <button className="p-2.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all">
            <Save className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-[#1c1917] hover:bg-black text-white text-sm font-medium transition-all shadow-md"
        >
          Start Over
        </button>
      </div>
    </motion.div>
  );
};

export default function Dinner() {
  // --- STATE & LOGIC ---
  const [view, setView] = useState<ViewState>("ENTRY");
  const [result, setResult] = useState<DinnerResult | null>(null);
  const [adults, setAdults] = useState("");
  const [kids, setKids] = useState("");
  const [mixedPrefs, setMixedPrefs] = useState(false);
  const [energyLevel, setEnergyLevel] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [kitchenSetup, setKitchenSetup] = useState("");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [pauseText, setPauseText] = useState("Putting something simple together...");

  useEffect(() => {
    if (view !== "THINKING") return;
    const phrases = [
      "Putting something simple together...",
      "Keeping this realistic...",
      "Making sure this feels doable...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setPauseText(phrases[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [view]);

  const handleSubmit = async () => {
    setView("THINKING");

    const formData = new FormData();
    formData.append("adults", adults);
    formData.append("kids", kids);
    formData.append("mixedPrefs", mixedPrefs.toString());
    formData.append("energyLevel", energyLevel);
    formData.append("timeAvailable", timeAvailable);
    formData.append("kitchenSetup", kitchenSetup);
    formData.append("restrictions", restrictions.join(", "));
    formData.append("additionalNotes", additionalNotes);

    try {
      const res = await fetch("/api/dinner", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Planning failed");
      const data = await res.json();

      setTimeout(() => {
        setResult(data);
        setView("RESULTS");
      }, 3000);
    } catch (err) {
      console.error(err);
      setView("REALITY");
    }
  };

  const reset = () => {
    setView("ENTRY");
    setResult(null);
    setAdults("");
    setKids("");
    setMixedPrefs(false);
    setEnergyLevel("");
    setTimeAvailable("");
    setKitchenSetup("");
    setRestrictions([]);
    setAdditionalNotes("");
  };

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "ENTRY" && <EntryScreen key="entry" setView={setView} />}
          {view === "WHO" && <WhoScreen key="who" setView={setView} adults={adults} setAdults={setAdults} kids={kids} setKids={setKids} mixedPrefs={mixedPrefs} setMixedPrefs={setMixedPrefs} />}
          {view === "ENERGY" && <EnergyScreen key="energy" setView={setView} energyLevel={energyLevel} setEnergyLevel={setEnergyLevel} />}
          {view === "TIME_SPACE" && <TimeSpaceScreen key="time_space" setView={setView} timeAvailable={timeAvailable} setTimeAvailable={setTimeAvailable} kitchenSetup={kitchenSetup} setKitchenSetup={setKitchenSetup} />}
          {view === "REALITY" && <RealityScreen key="reality" setView={setView} restrictions={restrictions} setRestrictions={setRestrictions} additionalNotes={additionalNotes} setAdditionalNotes={setAdditionalNotes} handleSubmit={handleSubmit} />}
          {view === "THINKING" && <ThinkingScreen key="thinking" pauseText={pauseText} />}
          {view === "RESULTS" && <ResultsScreen key="results" setView={setView} result={result} reset={reset} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
