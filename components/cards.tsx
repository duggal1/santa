"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FavouriteIcon,
  CursorMagicSelection01Icon,
  ZapIcon,
  ArrowLeft01Icon as ArrowLeft,
  AllBookmarkIcon as Save,
  Share01Icon as Share2,
  RotateLeft01Icon as RotateCcw,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ios-spinner";
import { cn } from "@/lib/utils";
import PhysicalCard from "@/components/PhysicalCard";

// --- TYPES ---
type CardResult = {
  card: string;
  recipient: string;
  intent: string;
  tone: string;
};

type ViewState = "ENTRY" | "WHO" | "INTENT" | "TONE" | "CONTEXT" | "THINKING" | "RESULTS";

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

// --- SCREEN COMPONENTS ---

interface ScreenProps {
  setView: (view: ViewState) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  intent: string;
  setIntent: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  context: string;
  setContext: (value: string) => void;
  handleSubmit: () => void;
  result: CardResult | null;
  reset: () => void;
  pauseText: string;
  refineCard: (action: string) => void;
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
        Write a Christmas card <br/>
        <span className="text-stone-400">that actually sounds like you</span>
      </h1>
      <p className="text-stone-600 font-medium text-lg">
        Honest. Warm. Simple. No clichés.
      </p>
    </div>

    <PrettyButton
      onClick={() => setView("WHO")}
      icon={FavouriteIcon}
    >
      Start writing
    </PrettyButton>
  </motion.div>
);

const WhoScreen = ({
  setView,
  recipient,
  setRecipient,
}: Pick<ScreenProps, 'setView' | 'recipient' | 'setRecipient'>) => (
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
      <h2 className="text-2xl font-medium text-stone-900">Who are you writing to?</h2>
    </div>

    <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-stone-900 font-medium text-base ml-2">Recipient</Label>
          <Input
            placeholder="Mom, partner, friend, coworker..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="h-16 rounded-2xl bg-stone-50 border-stone-200 text-lg font-medium px-6 focus:bg-white focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
          />
        </div>
        <p className="text-stone-500 text-sm ml-2">This helps set the tone. You can keep it simple.</p>
      </div>
    </div>

    <div className="flex justify-end">
      <PrettyButton
        onClick={() => setView("INTENT")}
        disabled={!recipient.trim()}
        icon={CursorMagicSelection01Icon}
      >
        Next
      </PrettyButton>
    </div>
  </motion.div>
);

const IntentScreen = ({
  setView,
  intent,
  setIntent,
}: Pick<ScreenProps, 'setView' | 'intent' | 'setIntent'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-5xl mx-auto space-y-8 py-10 pb-32"
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
      <h2 className="text-2xl font-medium text-stone-900">What do you want this card to express?</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { key: "Appreciation", title: "Appreciation", subtitle: "Thanking them" },
        { key: "Love", title: "Love", subtitle: "Saying what they mean to you" },
        { key: "Support", title: "Support", subtitle: "Being there for them" },
        { key: "Pride", title: "Pride", subtitle: "Acknowledging who they are" },
        { key: "Reconnection", title: "Reconnection", subtitle: "Closing distance" },
        { key: "Light", title: "Light & cheerful", subtitle: "Keeping it simple" },
      ].map((item) => (
        <SelectionCard
          key={item.key}
          title={item.title}
          subtitle={item.subtitle}
          onClick={() => setIntent(item.key)}
          selected={intent === item.key}
        />
      ))}
    </div>

    <div className="flex justify-end pt-8">
      <PrettyButton
        onClick={() => setView("TONE")}
        disabled={!intent}
        icon={CursorMagicSelection01Icon}
      >
        Next
      </PrettyButton>
    </div>
  </motion.div>
);

const ToneScreen = ({
  setView,
  tone,
  setTone,
}: Pick<ScreenProps, 'setView' | 'tone' | 'setTone'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-4xl mx-auto space-y-8 py-10 pb-32"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("INTENT")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-12 h-12 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">How should it sound?</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-64">
      {[
        { key: "Warm and simple", title: "Warm and simple" },
        { key: "Calm and sincere", title: "Calm and sincere" },
        { key: "Light and playful", title: "Light and playful" },
        { key: "Thoughtful and steady", title: "Thoughtful and steady" },
        { key: "Short and direct", title: "Short and direct" },
      ].map((item) => (
        <SelectionCard
          key={item.key}
          title={item.title}
          subtitle=""
          onClick={() => setTone(item.key)}
          selected={tone === item.key}
        />
      ))}
    </div>

    <div className="flex justify-end pt-8">
      <PrettyButton
        onClick={() => setView("CONTEXT")}
        disabled={!tone}
        icon={CursorMagicSelection01Icon}
      >
        Next
      </PrettyButton>
    </div>
  </motion.div>
);

const ContextScreen = ({
  setView,
  context,
  setContext,
  handleSubmit
}: Pick<ScreenProps, 'setView' | 'context' | 'setContext' | 'handleSubmit'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-2xl mx-auto space-y-8 py-10 pb-32"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("TONE")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-12 h-12 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">Final Details</h2>
    </div>

    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
      <div className="space-y-3">
        <Label className="text-stone-900 font-medium text-base ml-1">Anything you want to mention? (optional)</Label>
        <Textarea
          placeholder="A shared memory, a tough year, something you admire..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="min-h-[120px] rounded-2xl bg-stone-50 border-stone-200 text-base font-medium p-6 focus:bg-white focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 resize-none transition-all"
        />
      </div>
    </div>

    <div className="flex justify-end">
      <PrettyButton
        onClick={handleSubmit}
        icon={ZapIcon}
      >
        Write the card
      </PrettyButton>
    </div>
  </motion.div>
);

const ThinkingScreen = ({ pauseText }: Pick<ScreenProps, 'pauseText'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-[70vh] w-full space-y-8"
  >
    <div className="space-y-6">
      <Skeleton className="w-48 h-64 bg-stone-200 rounded-3xl" />
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

const ResultsScreen = ({ setView, result, reset, refineCard }: Pick<ScreenProps, 'setView' | 'result' | 'reset' | 'refineCard'>) => {
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto py-10 pb-40"
    >
       <div className="flex items-center gap-4 mb-10">
        <Button
          onClick={() => setView("CONTEXT")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 hover:bg-stone-100"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
        </Button>
        <span className="text-stone-400 font-medium tracking-wide">Your card</span>
      </div>

      <div className="space-y-16">
        {/* PHYSICAL CARD */}
        <PhysicalCard text={result.card} />

        {/* MICRO CONTROLS */}
        <div className="flex justify-center">
          <div className="flex gap-4">
            <Button
              onClick={() => refineCard("shorter")}
              variant="outline"
              className="rounded-full px-6 py-3 hover:bg-stone-50"
            >
              Make it shorter
            </Button>
            <Button
              onClick={() => refineCard("softer")}
              variant="outline"
              className="rounded-full px-6 py-3 hover:bg-stone-50"
            >
              Softer
            </Button>
            <Button
              onClick={() => refineCard("more_direct")}
              variant="outline"
              className="rounded-full px-6 py-3 hover:bg-stone-50"
            >
              More direct
            </Button>
            <Button
              onClick={() => refineCard("more_personal")}
              variant="outline"
              className="rounded-full px-6 py-3 hover:bg-stone-50"
            >
              More personal
            </Button>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white p-2 rounded-full border border-stone-200 shadow-2xl shadow-stone-200/50 z-50">
        <Button variant="ghost" className="h-12 w-12 rounded-full hover:bg-stone-50 text-stone-600">
          <Save className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-stone-200" />
        <Button variant="ghost" className="h-12 w-12 rounded-full hover:bg-stone-50 text-stone-600">
          <Share2 className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-stone-200" />
        <Button onClick={reset} variant="ghost" className="h-12 px-6 rounded-full hover:bg-stone-50 text-stone-900 font-medium">
          Start Over
        </Button>
      </div>
    </motion.div>
  );
};

export default function Cards() {
  // --- STATE & LOGIC ---
  const [view, setView] = useState<ViewState>("ENTRY");
  const [result, setResult] = useState<CardResult | null>(null);
  const [recipient, setRecipient] = useState("");
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState("");
  const [context, setContext] = useState("");
  const [pauseText, setPauseText] = useState("Finding the right words...");

  useEffect(() => {
    if (view !== "THINKING") return;
    const phrases = [
      "Finding the right words...",
      "Putting your feelings into words...",
      "Making it sound like you...",
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
    formData.append("recipient", recipient);
    formData.append("intent", intent);
    formData.append("tone", tone);
    formData.append("context", context);

    try {
      const res = await fetch("/api/cards", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Card generation failed");
      const data = await res.json();

      setTimeout(() => {
        setResult(data);
        setView("RESULTS");
      }, 3000);
    } catch (err) {
      console.error(err);
      setView("CONTEXT");
    }
  };

  const refineCard = async (action: string) => {
    if (!result) return;

    setView("THINKING");

    const formData = new FormData();
    formData.append("recipient", result.recipient);
    formData.append("intent", result.intent);
    formData.append("tone", result.tone);
    formData.append("context", context);
    formData.append("action", action);
    formData.append("currentCard", result.card);

    try {
      const res = await fetch("/api/cards", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Refinement failed");
      const data = await res.json();

      setTimeout(() => {
        setResult(data);
        setView("RESULTS");
      }, 2000);
    } catch (err) {
      console.error(err);
      setView("RESULTS");
    }
  };

  const reset = () => {
    setView("ENTRY");
    setResult(null);
    setRecipient("");
    setIntent("");
    setTone("");
    setContext("");
  };

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "ENTRY" && <EntryScreen key="entry" setView={setView} />}
          {view === "WHO" && <WhoScreen key="who" setView={setView} recipient={recipient} setRecipient={setRecipient} />}
          {view === "INTENT" && <IntentScreen key="intent" setView={setView} intent={intent} setIntent={setIntent} />}
          {view === "TONE" && <ToneScreen key="tone" setView={setView} tone={tone} setTone={setTone} />}
          {view === "CONTEXT" && <ContextScreen key="context" setView={setView} context={context} setContext={setContext} handleSubmit={handleSubmit} />}
          {view === "THINKING" && <ThinkingScreen key="thinking" pauseText={pauseText} />}
          {view === "RESULTS" && <ResultsScreen key="results" setView={setView} result={result} reset={reset} refineCard={refineCard} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
