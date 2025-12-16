"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload05Icon,
  CursorMagicSelection01Icon,
  ZapIcon,
  ArrowLeft01Icon as ArrowLeft,
  AllBookmarkIcon as Save,
  Share01Icon as Share2,
  RotateLeft01Icon as RotateCcw,
  Image01Icon as ImageIcon,
  TextIcon as TypeIcon,
  GiftIcon,
  GiftCardIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ios-spinner";
import { cn } from "@/lib/utils";

// --- TYPES ---
type GiftResult = {
  recommendation: string;
  why: string;
  alternative: string;
  avoid: string;
};

type ViewState = "ENTRY" | "PERSON" | "CONTEXT" | "IMAGE" | "THINKING" | "RESULTS";

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
  icon: Icon,
  title,
  subtitle,
  onClick
}: {
  icon: React.ElementType,
  title: string,
  subtitle: string,
  onClick: () => void
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative flex-1 flex flex-col items-center justify-center p-8 md:p-10
    bg-stone-50 rounded-4xl border border-stone-200
    hover:shadow-md
    transition-all duration-300 ease-out text-center space-y-5 h-full"
  >
    <div className="w-16 h-16 rounded-2xl bg-white text-stone-800 flex items-center justify-center group-hover:bg-stone-800 group-hover:text-stone-50 transition-colors duration-300 border border-stone-200">
      <Icon className="w-8 h-8" strokeWidth={1.5} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-medium text-stone-900">{title}</h3>
      <p className="text-stone-500 font-medium text-sm">{subtitle}</p>
    </div>
  </motion.button>
);

// --- SCREEN COMPONENTS ---

interface ScreenProps {
  setView: (view: ViewState) => void;
  person: string;
  setPerson: (value: string) => void;
  whatMatters: string;
  setWhatMatters: (value: string) => void;
  giftType: string;
  setGiftType: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  handleTextSubmit: () => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  result: GiftResult | null;
  reset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
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
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-stone-900 leading-tight">
          Find a Gift That <br/>
          <span className="text-stone-400">Feels Right</span>
        </h1>
        <p className="text-stone-600 font-medium text-lg">
          Something that actually suits them — not just the occasion.
        </p>
    </div>

    <PrettyButton
      onClick={() => setView("PERSON")}
      icon={GiftIcon}
    >
      Start Finding
    </PrettyButton>
  </motion.div>
);

const PersonScreen = ({ setView, person, setPerson }: Pick<ScreenProps, 'setView' | 'person' | 'setPerson'>) => (
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
        className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">Who is this gift for?</h2>
    </div>

    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="text-stone-900 font-medium text-base ml-2">Their name or how you think of them</Label>
        <Input
          placeholder="e.g. Mom, My best friend, My partner"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          className="h-16 rounded-2xl bg-white border-stone-200 text-lg font-medium px-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
        />
        <p className="text-stone-500 text-sm ml-2">You don't need to be perfect. Just start.</p>
      </div>

      <div className="pt-4 flex justify-end">
        <PrettyButton
          onClick={() => setView("CONTEXT")}
          disabled={!person.trim()}
          icon={CursorMagicSelection01Icon}
        >
          Next
        </PrettyButton>
      </div>
    </div>
  </motion.div>
);

const ContextScreen = ({ setView, whatMatters, setWhatMatters, giftType, setGiftType, budget, setBudget, handleTextSubmit }: Pick<ScreenProps, 'setView' | 'whatMatters' | 'setWhatMatters' | 'giftType' | 'setGiftType' | 'budget' | 'setBudget' | 'handleTextSubmit'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-xl mx-auto space-y-8 py-10 pb-32"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("PERSON")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
        <h2 className="text-2xl font-medium text-stone-900">Help us understand them</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-stone-900 font-medium text-base ml-2">What’s been important to them lately?</Label>
          <Textarea
            placeholder="Anything they’ve been talking about, dealing with, or spending time on."
            value={whatMatters}
            onChange={(e) => setWhatMatters(e.target.value)}
            className="min-h-[120px] rounded-2xl bg-white border-stone-200 text-base font-medium p-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 resize-none transition-all"
          />
        </div>

      <div className="space-y-3">
        <Label className="text-stone-900 font-medium text-base ml-2 flex items-center gap-2">
          What do you want this gift to feel like?
          <span className="text-[#ff5151] text-xs font-semibold uppercase tracking-wider">(RECOMMENDED)</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Genuinely caring",
            "Naturally useful",
            "Thoughtfully chosen",
            "Light and easy",
            "Meaningful, not loud"
          ].map((type) => (
            <button
              key={type}
              onClick={() => setGiftType(type)}
              className={cn(
                "p-4 rounded-2xl border text-center font-medium transition-all text-sm",
                giftType === type
                  ? "bg-stone-800 text-stone-50 border-stone-900 shadow-lg"
                  : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <p className="text-stone-500 text-sm mt-2 text-center">There's no right answer — just what feels honest.</p>
      </div>

      <div className="space-y-3">
        <Label className="text-stone-900 font-medium text-base ml-2">What feels comfortable to spend?</Label>
        <Input
          placeholder="e.g. $20-50"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="h-16 rounded-2xl bg-white border-stone-200 text-lg font-medium px-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
        />
      </div>

      <div className="pt-4 flex justify-between">
        <Button
          onClick={() => setView("IMAGE")}
          variant="outline"
          className="rounded-2xl px-6"
        >
          Add Photo (Optional)
        </Button>
        <PrettyButton
          onClick={handleTextSubmit}
          disabled={!whatMatters.trim() || !giftType || !budget.trim()}
          icon={ZapIcon}
        >
          Find Gift
        </PrettyButton>
      </div>
    </div>
  </motion.div>
);

const ImageScreen = ({ setView, handlePhotoUpload, handleTextSubmit, fileInputRef }: Pick<ScreenProps, 'setView' | 'handlePhotoUpload' | 'handleTextSubmit' | 'fileInputRef'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-2xl mx-auto space-y-8 py-10"
  >
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setView("CONTEXT")}
        variant="ghost"
        size="icon"
        className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
      >
        <ArrowLeft className="w-5 h-5 text-stone-800" />
      </Button>
      <h2 className="text-2xl font-medium text-stone-900">Want to share a visual hint?</h2>
    </div>

    <div className="bg-white rounded-[2.5rem] p-12 border border-stone-200/50 shadow-sm text-center space-y-8">
      <div className="w-24 h-24 mx-auto bg-stone-50 rounded-3xl flex items-center justify-center text-stone-400">
         <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <p className="text-stone-900 font-medium text-xl">Share something they love</p>
        <p className="text-stone-500 font-medium">Something they feel at home around, use often, or feel connected to.</p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        ref={fileInputRef}
        id="photo-upload"
      />

      <div className="flex justify-center pt-4">
        <PrettyButton icon={Upload05Icon} onClick={() => fileInputRef.current?.click()}>
          Choose Image
        </PrettyButton>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleTextSubmit}
          variant="outline"
          className="rounded-2xl px-6"
        >
          Skip & Find Gift
        </Button>
      </div>
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Recommendation card skeleton */}
      <div className="bg-white rounded-4xl p-12 border border-stone-100 shadow-sm mx-auto max-w-3xl">
        <div className="text-center space-y-6">
          <Skeleton className="h-4 w-32 bg-stone-200 rounded mx-auto" />
          <Skeleton className="h-10 w-96 bg-stone-200 rounded-lg mx-auto" />
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

const ResultsScreen = ({ setView, imagePreview, result, reset }: Pick<ScreenProps, 'setView' | 'imagePreview' | 'result' | 'reset'>) => {
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto py-10 pb-40"
    >
       <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => setView("CONTEXT")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
        </Button>
         <span className="text-stone-400 font-medium">Gift Recommendation</span>
      </div>

      {/* CENTERED RECOMMENDATION CONTENT */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* RECOMMENDATION */}
        <div className="text-center">
          <div className="bg-white rounded-4xl p-12 border border-stone-100 shadow-sm mx-auto max-w-3xl">
            <h3 className="text-base font-semibold text-stone-500 uppercase tracking-wider mb-6">A Thoughtful Fit</h3>
            <p className="text-3xl md:text-4xl font-medium text-stone-900 leading-tight">
              {result.recommendation}
            </p>
          </div>
        </div>

        {/* WHY */}
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest opacity-60 mb-8">Why This Makes Sense</h3>
          <p className="text-stone-700 font-medium text-xl leading-relaxed">
            {result.why}
          </p>
        </div>

        {/* ALTERNATIVE */}
        {result.alternative && (
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest opacity-60 mb-8">Alternative Angle</h3>
            <p className="text-stone-700 font-medium text-xl leading-relaxed">
              {result.alternative}
            </p>
          </div>
        )}

        {/* AVOID */}
        {result.avoid && (
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest opacity-60 mb-8">Probably Skip</h3>
            <p className="text-stone-700 font-medium text-xl leading-relaxed">
              {result.avoid}
            </p>
          </div>
        )}

        {/* UPLOADED IMAGE - if present */}
        {imagePreview && (
          <div className="text-center max-w-2xl mx-auto">
            <img
              src={imagePreview}
              alt="Reference image"
              className="w-full h-auto object-contain rounded-3xl shadow-sm border border-stone-100"
              style={{ imageRendering: 'auto' }}
            />
            <p className="text-stone-500 text-sm font-medium mt-4">Your reference image</p>
          </div>
        )}
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

export default function Gifts() {
  // --- STATE & LOGIC ---
  const [view, setView] = useState<ViewState>("ENTRY");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<GiftResult | null>(null);
  const [person, setPerson] = useState("");
  const [whatMatters, setWhatMatters] = useState("");
  const [giftType, setGiftType] = useState("");
  const [budget, setBudget] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pauseText, setPauseText] = useState("Thinking about what would feel right...");

  useEffect(() => {
    if (view !== "THINKING") return;
    const phrases = [
      "Thinking about what would genuinely suit them...",
      "Considering what would feel thoughtful, not obvious...",
      "Looking for something that won’t feel generic...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setPauseText(phrases[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [view]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setView("THINKING");

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      const formDataToSend = new FormData();
      formDataToSend.append("image", file);
      formDataToSend.append("person", person);
      formDataToSend.append("whatMatters", whatMatters);
      formDataToSend.append("giftType", giftType);
      formDataToSend.append("budget", budget);

      try {
        const res = await fetch("/api/gifts", { method: "POST", body: formDataToSend });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();

        setTimeout(() => {
          setResult(data);
          setView("RESULTS");
        }, 3000);
      } catch (err) {
        console.error(err);
        setView("CONTEXT");
      }
    }
  };

  const handleTextSubmit = async () => {
    setView("THINKING");

    const formDataToSend = new FormData();
    formDataToSend.append("person", person);
    formDataToSend.append("whatMatters", whatMatters);
    formDataToSend.append("giftType", giftType);
    formDataToSend.append("budget", budget);

    try {
      const res = await fetch("/api/gifts", { method: "POST", body: formDataToSend });
      if (!res.ok) throw new Error("Analysis failed");
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

  const reset = () => {
    setView("ENTRY");
    setImagePreview(null);
    setResult(null);
    setPerson("");
    setWhatMatters("");
    setGiftType("");
    setBudget("");
  };

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "ENTRY" && <EntryScreen key="entry" setView={setView} />}
          {view === "PERSON" && <PersonScreen key="person" setView={setView} person={person} setPerson={setPerson} />}
          {view === "CONTEXT" && <ContextScreen key="context" setView={setView} whatMatters={whatMatters} setWhatMatters={setWhatMatters} giftType={giftType} setGiftType={setGiftType} budget={budget} setBudget={setBudget} handleTextSubmit={handleTextSubmit} />}
          {view === "IMAGE" && <ImageScreen key="image" setView={setView} handlePhotoUpload={handlePhotoUpload} handleTextSubmit={handleTextSubmit} fileInputRef={fileInputRef} />}
          {view === "THINKING" && <ThinkingScreen key="thinking" pauseText={pauseText} />}
          {view === "RESULTS" && <ResultsScreen key="results" setView={setView} imagePreview={imagePreview} result={result} reset={reset} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
