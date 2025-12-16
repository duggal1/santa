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
  TextIcon as TypeIcon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ios-spinner";
import { cn } from "@/lib/utils";

// --- TYPES ---
type AnalysisResult = {
  summary: string;
  beautiful: string[];
  holdingBack: string[];
  change: string[];
  ignore: string;
  close: string;
};

type ViewState = "ENTRY" | "CHOICE" | "PHOTO_INPUT" | "TEXT_INPUT" | "ANALYZING" | "RESULTS";

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
    bg-white rounded-4xl border border-stone-200/60
    shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
    hover:border-[#ff5151]/30 hover:shadow-[0_8px_30px_-6px_rgba(237,66,66,0.15)]
    transition-all duration-300 ease-out text-center space-y-5 h-full"
  >
    <div className="w-16 h-16 rounded-2xl bg-stone-50 text-stone-800 flex items-center justify-center group-hover:bg-[#ff5151] group-hover:text-white transition-colors duration-300">
      <Icon className="w-8 h-8" strokeWidth={1.5} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-medium text-stone-900">{title}</h3>
      <p className="text-stone-500 font-medium text-sm">{subtitle}</p>
    </div>
  </motion.button>
);

export default function DecorAnalysis() {
  // --- STATE & LOGIC ---
  const [view, setView] = useState<ViewState>("ENTRY");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [textForm, setTextForm] = useState({
    area: "",
    feelsOff: "",
    keepAsIs: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pauseText, setPauseText] = useState("Looking at balance and light...");

  useEffect(() => {
    if (view !== "ANALYZING") return;
    const phrases = [
      "Looking at balance and light...",
      "Noticing what draws the eye...",
      "Separating what works from what doesn't...",
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
      setView("ANALYZING");

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/decor", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();

        setTimeout(() => {
          setResult(data);
          setView("RESULTS");
        }, 3000);
      } catch (err) {
        console.error(err);
        setView("CHOICE");
      }
    }
  };

  const handleTextSubmit = async () => {
    setView("ANALYZING");

    const formData = new FormData();
    formData.append("textInput", textForm.description);
    formData.append("area", textForm.area);
    formData.append("feelsOff", textForm.feelsOff);
    formData.append("keepAsIs", textForm.keepAsIs);

    try {
      const res = await fetch("/api/decor", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      setTimeout(() => {
        setResult(data);
        setView("RESULTS");
      }, 3000);
    } catch (err) {
      console.error(err);
      setView("CHOICE");
    }
  };

  const reset = () => {
    setView("ENTRY");
    setImagePreview(null);
    setResult(null);
    setTextForm({ area: "", feelsOff: "", keepAsIs: "", description: "" });
  };

  // --- UI SCREENS ---

  const EntryScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto"
    >
      <div className="space-y-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-stone-900 leading-tight">
          Improve My <br/>
          <span className="text-stone-400">Christmas Decor</span>
        </h1>
        <p className="text-stone-600 font-medium text-lg">
          Clear guidance. No starting over.
        </p>
      </div>

      <PrettyButton
        onClick={() => setView("CHOICE")}
        icon={CursorMagicSelection01Icon}
      >
        Start Analysis
      </PrettyButton>
    </motion.div>
  );

  const ChoiceScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto space-y-10 py-10"
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
        <h2 className="text-2xl font-medium text-stone-900">How should we start?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
        <SelectionCard
          icon={Upload05Icon}
          title="Upload Photo"
          subtitle="See what works and what doesn't."
          onClick={() => setView("PHOTO_INPUT")}
        />
        <SelectionCard
          icon={TypeIcon}
          title="Describe Space"
          subtitle="If you can't take a photo right now."
          onClick={() => setView("TEXT_INPUT")}
        />
      </div>
    </motion.div>
  );

  const PhotoInputScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto space-y-8 py-10"
    >
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setView("CHOICE")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
        </Button>
        <h2 className="text-2xl font-medium text-stone-900">Upload your space</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 border border-stone-200/50 shadow-sm text-center space-y-8">
        <div className="w-24 h-24 mx-auto bg-stone-50 rounded-3xl flex items-center justify-center text-stone-400">
           <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <p className="text-stone-900 font-medium text-xl">Select a photo from your device</p>
          <p className="text-stone-500 font-medium">Any area: Tree, Living Room, or Corner</p>
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
      </div>
    </motion.div>
  );

  const TextInputScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl mx-auto space-y-8 py-10 pb-32"
    >
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setView("CHOICE")}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
        </Button>
        <h2 className="text-2xl font-medium text-stone-900">Details</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-stone-900 font-medium text-base ml-2">Which area is this?</Label>
          <Input
            placeholder="e.g. Living Room"
            value={textForm.area}
            onChange={(e) => setTextForm(prev => ({ ...prev, area: e.target.value }))}
            className="h-16 rounded-2xl bg-white border-stone-200 text-lg font-medium px-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-stone-900 font-medium text-base ml-2">What feels off?</Label>
            <Textarea
              placeholder="Optional..."
              value={textForm.feelsOff}
              onChange={(e) => setTextForm(prev => ({ ...prev, feelsOff: e.target.value }))}
              className="min-h-[120px] rounded-2xl bg-white border-stone-200 text-base font-medium p-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 resize-none transition-all"
            />
          </div>
          <div className="space-y-3">
             <Label className="text-stone-900 font-medium text-base ml-2">Keep as is?</Label>
            <Textarea
              placeholder="Optional..."
              value={textForm.keepAsIs}
              onChange={(e) => setTextForm(prev => ({ ...prev, keepAsIs: e.target.value }))}
              className="min-h-[120px] rounded-2xl bg-white border-stone-200 text-base font-medium p-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 resize-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-stone-900 font-medium text-base ml-2">Describe the setup</Label>
          <Textarea
            placeholder="Tell us about the decorations..."
            value={textForm.description}
            onChange={(e) => setTextForm(prev => ({ ...prev, description: e.target.value }))}
            className="min-h-[140px] rounded-2xl bg-white border-stone-200 text-base font-medium p-6 focus:ring-0 focus:border-stone-400 placeholder:text-stone-300 resize-none transition-all"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <PrettyButton 
            onClick={handleTextSubmit} 
            disabled={!textForm.description.trim()}
            icon={ZapIcon}
          >
            Run Analysis
          </PrettyButton>
        </div>
      </div>
    </motion.div>
  );

  const AnalyzingScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-[70vh] w-full space-y-8"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Analysis summary skeleton */}
        <div className="bg-white rounded-4xl p-8 md:p-10 border border-stone-100 shadow-sm">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 bg-stone-200 rounded-lg" />
            <Skeleton className="h-6 w-full bg-stone-100 rounded" />
            <Skeleton className="h-6 w-5/6 bg-stone-100 rounded" />
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

  const ResultsScreen = () => {
    if (!result) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto py-10 pb-40"
      >
         <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => setView("CHOICE")}
            variant="ghost"
            size="icon"
            className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
          </Button>
           <span className="text-stone-400 font-medium">Results</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - ANALYSIS CONTENT */}
          <div className="space-y-8">
            {/* 1. SUMMARY */}
            <div className="bg-white rounded-4xl p-8 md:p-10 border border-stone-100 shadow-sm">
              <p className="text-2xl md:text-3xl font-medium text-stone-900 leading-snug">
                {result.summary}
              </p>
            </div>

            <div className="grid gap-12">
          {/* 2. BEAUTIFUL */}
          {result.beautiful.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest opacity-40">What's Beautiful</h3>
              <ul className="space-y-4">
                {result.beautiful.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-stone-700 font-medium text-lg leading-relaxed">
                    <span className="mt-3 w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. HOLDING BACK */}
          {result.holdingBack.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest opacity-40">Holding It Back</h3>
              <ul className="space-y-4">
                {result.holdingBack.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-stone-700 font-medium text-lg leading-relaxed">
                    <span className="mt-3 w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. THE FIX */}
          {result.change.length > 0 && (
            <div className="space-y-6">
               <h3 className="text-sm font-bold text-[#ff5151] uppercase tracking-widest">The Fix</h3>
              <ul className="space-y-4">
                {result.change.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-stone-900 font-medium text-xl leading-relaxed">
                    <span className="mt-3 w-1.5 h-1.5 rounded-full bg-[#ff5151] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. IGNORE */}
          {result.ignore && (
             <div className="pt-6 border-t border-stone-100">
               <p className="text-stone-400 font-medium text-base">
                 {result.ignore}
               </p>
             </div>
          )}
        </div>
             </div>

          {/* RIGHT SIDE - UPLOADED IMAGE */}
          {imagePreview && (
            <div className="lg:sticky lg:top-8">
              <img
                src={imagePreview}
                alt="Your uploaded Christmas decor"
                className="w-full h-auto object-contain rounded-2xl"
                style={{ imageRendering: 'auto' }}
              />
              <div className="mt-4 text-center">
                <p className="text-stone-500 text-sm font-medium">Your uploaded image</p>
              </div>
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

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "ENTRY" && <EntryScreen key="entry" />}
          {view === "CHOICE" && <ChoiceScreen key="choice" />}
          {view === "PHOTO_INPUT" && <PhotoInputScreen key="photo" />}
          {view === "TEXT_INPUT" && <TextInputScreen key="text" />}
          {view === "ANALYZING" && <AnalyzingScreen key="analyzing" />}
          {view === "RESULTS" && <ResultsScreen key="results" />}
        </AnimatePresence>
      </div>
    </main>
  );
}
