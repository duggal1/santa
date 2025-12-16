"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FavouriteIcon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ios-spinner";
import { cn } from "@/lib/utils";

// --- TYPES ---
type SantaResult = {
  note: string;
  title: string;
};

// Pre-written calming notes (stable, curated)
const SANTA_NOTES: SantaResult[] = [
  {
    title: "A Quiet Moment",
    note: "You've been carrying a lot this year.\n\nSome of it visible. Some of it quiet.\n\nYou don't need to have everything figured out tonight.\n\nShowing up was already enough.\n\nTake the rest slowly."
  },
  {
    title: "Permission to Rest",
    note: "The season asks so much of everyone.\n\nYou've given what you could.\n\nNow it's okay to step back.\n\nTo let tomorrow bring what it will.\n\nYou've earned this quiet moment."
  },
  {
    title: "Steady Ground",
    note: "Not every question needs an answer tonight.\n\nNot every feeling needs a name.\n\nSome things just need to be held gently.\n\nYou've carried them this far.\n\nYou're not alone in it."
  },
  {
    title: "Soft Light",
    note: "The holidays can feel like a spotlight sometimes.\n\nToo much brightness, too many expectations.\n\nIt's okay to step into the softer light.\n\nThe one that doesn't demand performance.\n\nJust gentle presence."
  },
  {
    title: "Enough for Today",
    note: "You've done what you could with what you had.\n\nThat's always been enough.\n\nThe rest can wait until morning.\n\nUntil you feel ready.\n\nUntil it feels right."
  },
  {
    title: "Quiet Strength",
    note: "Some of the hardest work happens in silence.\n\nThe kind that doesn't get seen or celebrated.\n\nBut it matters.\n\nYou've been doing it all along.\n\nThat strength is real."
  },
  {
    title: "Gentle Permission",
    note: "You don't have to be everything for everyone tonight.\n\nIt's okay to set some things down.\n\nTo let the evening unfold as it will.\n\nYou've already given so much.\n\nRest comes next."
  },
  {
    title: "Still Point",
    note: "In the middle of all the movement,\nthere's a quiet place you can return to.\n\nNot to solve anything.\nNot to change anything.\n\nJust to breathe.\nJust to be.\n\nIt's always there."
  },
  {
    title: "Soft Landing",
    note: "The day doesn't have to be perfect to be good.\n\nThe evening doesn't have to be special to matter.\n\nSometimes the most important moments\nare the quiet ones.\n\nThe ones where you can just be yourself."
  },
  {
    title: "Carried Well",
    note: "You've been carrying so many things this year.\n\nSome light, some heavy.\n\nAll important in their own way.\n\nYou've done it with grace.\n\nEven on the hard days."
  }
];

// Get stable note based on date (same note per day)
const getStableNote = (): SantaResult => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return SANTA_NOTES[dayOfYear % SANTA_NOTES.length];
};

// --- SCREEN COMPONENTS ---

interface ScreenProps {
  setView: (view: ViewState) => void;
  result: SantaResult | null;
  reset: () => void;
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
    A Note from <br/>
    <span className="text-stone-500 antialiased"> Santa</span>
  </h1>
  <p className="text-stone-600 font-medium text-lg">
    Just something small to read.<br />
    No expectations. No pressure.
  </p>
</div>


    <div className="flex flex-col gap-4">
      <PrettyButton
        onClick={() => setView("NOTE")}
        icon={FavouriteIcon}
      >
        Read my note
      </PrettyButton>

   
    </div>
  </motion.div>
);

const ThinkingScreen = ({ pauseText }: { pauseText: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-[70vh] w-full space-y-8"
  >
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Letter-like skeleton */}
      <div className="bg-[#f1f5f9] rounded-3xl p-8 md:p-12">
        <div className="text-center space-y-6">
          <Skeleton className="h-8 w-48 bg-stone-200 rounded-lg mx-auto" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-stone-100 rounded" />
            <Skeleton className="h-4 w-5/6 bg-stone-100 rounded mx-auto" />
            <Skeleton className="h-4 w-4/5 bg-stone-100 rounded mx-auto" />
            <Skeleton className="h-4 w-full bg-stone-100 rounded" />
            <Skeleton className="h-4 w-3/4 bg-stone-100 rounded mx-auto" />
          </div>
          <Skeleton className="h-6 w-16 bg-stone-200 rounded mx-auto" />
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

const NoteScreen = ({ result, reset }: Pick<ScreenProps, 'result' | 'reset'>) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap');` }} />
      <section className="relative w-full bg-[#f1f5f9] py-12 sm:py-16 md:py-32">
        {/* Top Zigzag: Snowy teeth pointing UP into the White section */}
        <div className="absolute -top-5 left-0 w-full h-5 z-10" style={{ borderRadius: '44px' }}>
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(315deg, #f1f5f9 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-8 md:p-12 ">
            <div className="text-center">

              <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl text-stone-800 mb-6 sm:mb-8 md:mb-10 leading-tight" style={{ fontFamily: '"Dancing Script", cursive', fontWeight: 600 }}>
                {result.title}
              </h2>
              <p className="text-xl md:text-lg lg:text-3xl text-stone-600 leading-relaxed font-light whitespace-pre-line max-w-2xl mx-auto" style={{ fontFamily: '"Dancing Script", cursive' }}>
              {result.note}
              </p>
              <div className="mt-8 sm:mt-10 md:mt-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-stone-400" style={{ fontFamily: '"Dancing Script", cursive', fontWeight: 700 }}>
                - S.C.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Zigzag: Snowy teeth pointing DOWN into the next White section */}
        <div className="absolute -bottom-5 left-0 w-full h-5 z-10" style={{ borderRadius: '24px' }}>
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(135deg, #f1f5f9 25%, transparent 25%), linear-gradient(225deg, #f1f5f9 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex justify-center gap-4 mt-8 pb-40">
        <Button
          variant="outline"
          className="rounded-full px-6 py-3 hover:bg-stone-50"
        >
          Save this
        </Button>
        <Button
          onClick={reset}
          variant="ghost"
          className="rounded-full px-6 py-3 text-stone-500 hover:text-stone-700"
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

type ViewState = "ENTRY" | "THINKING" | "NOTE";

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

export default function Santa() {
  const [view, setView] = useState<ViewState>("ENTRY");
  const [result, setResult] = useState<SantaResult | null>(null);

  useEffect(() => {
    if (view === "NOTE" && !result) {
      // Fetch personalized note from API
      handleGenerateNote();
    }
  }, [view, result]);

  const handleGenerateNote = async () => {
    setView("THINKING");
    try {
      const response = await fetch("/api/santa", { method: "POST" });
      if (!response.ok) throw new Error("Failed to generate note");
      const data = await response.json();
      setTimeout(() => {
        setResult(data);
        setView("NOTE");
      }, 2500);
    } catch (err) {
      console.error(err);
      setView("ENTRY");
    }
  };

  const reset = () => {
    setView("ENTRY");
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "ENTRY" && <EntryScreen key="entry" setView={setView} />}
          {view === "THINKING" && <ThinkingScreen key="thinking" pauseText="Finding the right words..." /> }
          {view === "NOTE" && <NoteScreen key="note" result={result} reset={reset} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
