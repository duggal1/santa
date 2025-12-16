"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload05Icon as UploadIcon,
  ArrowLeft01Icon as ArrowLeft,
  Download01Icon as Download,
  SentIcon as Share2,
  RotateLeft01Icon as RotateCcw,
  MagicWand01Icon as Sparkles,
  PencilEdit02Icon as Wand2,
  CursorMagicSelection01Icon as Rate

} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ios-spinner";

// --- TYPES ---
type AnalysisResult = {
  score: number;
  category: string;
  commentary: string;
  suggestions: string[];
};

type ViewState = "ENTRY" | "ANALYZING" | "RESULT" | "EDIT" | "EDIT_ENHANCING";
type EnhanceState = null | "select" | "gentle" | "cozy" | "calm" | "luxury" | "generating" | "done";

// --- CUSTOM UI COMPONENTS ---

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
  onClick,
  colorClass = "group-hover:bg-[#ff5151]"
}: { 
  icon: React.ElementType, 
  title: string, 
  subtitle: string, 
  onClick: () => void,
  colorClass?: string
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative flex-1 flex flex-col items-center justify-center p-8 md:p-10 
    bg-white rounded-4xl border border-stone-200/60
    shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
    hover:border-[#ff5151]/30 hover:shadow-[0_8px_30px_-6px_rgba(237,66,66,0.15)]
    transition-all duration-300 ease-out text-center space-y-5 h-full w-full"
  >
    <div className={cn(
      "w-16 h-16 rounded-2xl bg-stone-50 text-stone-800 flex items-center justify-center group-hover:text-white transition-colors duration-300",
      colorClass
    )}>
      <Icon className="w-8 h-8" strokeWidth={1.5} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-medium text-stone-900">{title}</h3>
      <p className="text-stone-500 font-medium text-sm">{subtitle}</p>
    </div>
  </motion.button>
);

const StyleOption = ({
  label,
  onClick,
  active
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-14 rounded-2xl border font-medium text-sm transition-all duration-200 px-4",
      active 
        ? "bg-stone-900 text-white border-stone-900 shadow-lg" 
        : "bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50"
    )}
  >
    {label}
  </button>
);

export default function ChristmasVibeJudge() {
  // --- STATE ---
  const [view, setView] = useState<ViewState>("ENTRY");
  const [started, setStarted] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [enhanceState, setEnhanceState] = useState<EnhanceState>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [pauseText, setPauseText] = useState("Taking a gentle look...");

  // --- EFFECTS ---
  useEffect(() => {
    // Check localStorage first for user name
    const storedName = localStorage.getItem('userDisplayName');
    if (storedName) {
      setUserName(storedName);
    } else {
      // Fetch from API if not in localStorage
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.displayName) {
            setUserName(data.displayName);
            localStorage.setItem('userDisplayName', data.displayName);
          }
        })
        .catch(err => console.error('Failed to fetch user name:', err));
    }
  }, []);

  useEffect(() => {
    if (view !== "ANALYZING" && enhanceState !== 'generating') return;

    const phrases = [
      "Taking a gentle look...",
      "Noticing the feeling in your space...",
      "Looking for the warmth...",
      "Almost there..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setPauseText(phrases[i]);
    }, 2800);

    return () => clearInterval(interval);
  }, [view, enhanceState]);

  // --- HANDLERS ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setView("ANALYZING");

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/analyze", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();

        setTimeout(() => {
          setResult(data);
          setView("RESULT");
        }, 2500);
      } catch (err) {
        console.error(err);
        setView("ENTRY");
      }
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();
  
  const reset = () => {
    setView("ENTRY");
    setImagePreview(null);
    setResult(null);
    setEnhanceState(null);
    setEnhancedImage(null);
  };

  const handleEnhance = async (type: 'gentle' | 'cozy' | 'calm' | 'luxury') => {
    setEnhanceState('generating');

    try {
      const response = await fetch(imagePreview!);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, type }),
      });

      if (!res.ok) throw new Error('Enhancement failed');
      const data = await res.json();
      
      setEnhancedImage(data.image);
      setEnhanceState('done');
    } catch (err) {
      console.error(err);
      setEnhanceState('select');
    }
  };

  const handleEditUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setView("EDIT_ENHANCING");
      setEnhanceState('select');
      // Reset the file input
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    }
  };

  const triggerEditUpload = () => editFileInputRef.current?.click();

  const downloadImage = async (imageUrl: string, filename: string = 'enhanced-christmas-setup.png') => {
    try {
      // Fetch the image as blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create object URL for download
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // --- UI SCREENS ---

  const EntryScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto relative"
    >
 {!started && userName && (
  <div className="flex justify-center items-center gap-3 font-medium text-4xl lg:text-5xl text-stone-700 antialiased">
    {/* Emoji container (layout-stable) */}
    <span className="relative flex h-8 w-8 items-center justify-center">
  
    </span>

    {/* Text */}
    <span className="leading-tight">
      Hey {userName},
          <motion.span
        animate={{ rotate: [0, 12, -8, 12, 0] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatDelay: 2.5,
          ease: "easeInOut",
        }}
        className="absolute select-none"
        style={{
          transformOrigin: "50% 100%",
          lineHeight: "1",
        }}
      >
        👋
      </motion.span>
      {" "} <br/>
      <span className="text-stone-400">welcome back</span>
    </span>
  </div>
)}

      {!started && (
        <div className="pt-8">
          <PrettyButton onClick={() => setStarted(true)}>
     Let’s Get Started
          </PrettyButton>
        </div>
      )}

      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div className="space-y-6 mb-16">
              <h1 className="text-4xl md:text-5xl mt-8 font-medium tracking-tight text-stone-900 leading-[1.1]">
                Make My Christmas <br/>
                <span className="text-stone-400">Beautiful</span>
              </h1>
              <p className="text-stone-600 font-medium text-lg">
                Rate your setup or refine it with AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <SelectionCard
                icon={Rate}
                title="Rate Setup"
                subtitle="Get a vibe score & feedback."
                onClick={triggerUpload}
              />
              <SelectionCard
                icon={Wand2}
                title="Edit Setup"
                subtitle="Enhance it with AI magic."
                onClick={() => setView("EDIT")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const EditScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto space-y-8 py-10"
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
        <h2 className="text-2xl font-medium text-stone-900">Upload to Enhance</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 border border-stone-200/50 shadow-sm text-center space-y-8">
        <div className="w-24 h-24 mx-auto bg-stone-50 rounded-3xl flex items-center justify-center text-stone-400">
           <UploadIcon className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <p className="text-stone-900 font-medium text-xl">Upload your Christmas setup</p>
          <p className="text-stone-500 font-medium">We'll refine lighting and balance.</p>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleEditUpload}
          className="hidden"
          ref={editFileInputRef}
          id="edit-upload"
        />
        
        <div className="flex justify-center pt-4">
          <PrettyButton icon={UploadIcon} onClick={triggerEditUpload} className="cursor-pointer">
            Select Photo
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
      <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-lg shadow-stone-100/20 flex flex-col md:flex-row items-center gap-10 text-center md:text-left max-w-2xl">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-stone-100 via-stone-50 to-stone-200 border-4 border-stone-50 shadow-xl shadow-stone-900/10 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-stone-200 to-stone-300 animate-pulse"></div>
          </div>
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <div className="bg-[#ff5151] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              <div className="w-8 h-2 bg-stone-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <div className="h-8 w-3/4 bg-linear-to-r from-stone-200 via-stone-100 to-stone-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-full bg-linear-to-r from-stone-100 to-stone-200 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-linear-to-r from-stone-100 to-stone-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="h-20 flex items-center justify-center">
        <Spinner size={40} color="#ff5151" />
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

  const EditEnhancingScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto py-10 pb-40 space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button
          onClick={reset}
          variant="ghost"
          size="icon"
          className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
        </Button>
        <h2 className="text-xl font-medium text-stone-500">Magic Edit</h2>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {enhanceState === 'generating' ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full space-y-8 overflow-hidden">
          <div className="w-full max-w-3xl space-y-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Before */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-16 bg-stone-200 rounded-full mx-auto" />
                <div className="rounded-4xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50 aspect-[4/5] relative max-w-sm mx-auto">
                  <div className="w-full h-full bg-linear-to-br from-stone-100 via-stone-50 to-stone-100 animate-pulse"></div>
                  <div className="absolute inset-0 bg-stone-100/50 animate-pulse"></div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-16 bg-stone-200 rounded-full mx-auto" />
                <div className="rounded-4xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50 aspect-[4/5] relative max-w-sm mx-auto">
                  <div className="w-full h-full bg-linear-to-br from-stone-100 via-stone-50 to-stone-100 animate-pulse"></div>
                  <div className="absolute inset-0 bg-stone-100/50 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center">
              <Spinner size={40} color="#ff5151" />
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {enhanceState === 'select' && (
            <div className="text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-medium text-stone-900">Choose a Vibe</h3>
                <p className="text-stone-500 font-medium">We keep the layout, just fix the feeling.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StyleOption label="Gentle Refinement" onClick={() => handleEnhance('gentle')} />
                <StyleOption label="Extra Cozy" onClick={() => handleEnhance('cozy')} />
                <StyleOption label="Modern Calm" onClick={() => handleEnhance('calm')} />
                <StyleOption label="Quiet Luxury" onClick={() => handleEnhance('luxury')} />
              </div>

              <div className="rounded-4xl overflow-hidden border border-stone-200 shadow-sm max-w-md mx-auto mt-8">
                 <img src={imagePreview!} alt="Original" className="w-full h-auto opacity-80" />
              </div>
            </div>
          )}

          {enhanceState === 'done' && enhancedImage && (
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Before */}
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-bold uppercase tracking-widest">
                      Original
                    </span>
                    <div className="rounded-4xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50 aspect-4/5 relative group">
                      <img src={imagePreview!} alt="Original" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#ff5151]/10 text-[#ff5151] text-xs font-bold uppercase tracking-widest">
                      Refined
                    </span>
                    <div className="rounded-4xl overflow-hidden border border-[#ff5151]/20 shadow-xl shadow-[#ff5151]/10 bg-stone-50 aspect-4/5 relative group">
                      <img src={enhancedImage} alt="Refined" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <Sparkles className="w-5 h-5 text-[#ff5151]" />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="flex justify-center gap-4">
                  <PrettyButton icon={Download} onClick={() => enhancedImage && downloadImage(enhancedImage)}>Save</PrettyButton>
                  <Button
                    onClick={() => { setEnhanceState('select'); setEnhancedImage(null); }}
                    variant="outline"
                    className="h-14 px-8 rounded-full border-stone-200 text-stone-600 font-medium hover:bg-stone-50"
                  >
                    Try Another Vibe
                  </Button>
               </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  const ResultScreen = () => {
    if (!result) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto py-10 pb-40 space-y-12"
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={reset}
            variant="ghost"
            size="icon"
            className="rounded-2xl w-12 h-12 p-3 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
          </Button>
          <span className="text-stone-400 font-medium">Analysis Results</span>
        </div>

        {/* 1. SCORE CARD */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
           <div className="relative">
             <div className="w-32 h-32 rounded-full border-4 border-stone-50 flex items-center justify-center bg-stone-900 text-white shadow-xl">
               <span className="text-5xl font-bold tracking-tighter">{result.score}</span>
             </div>
             <div className="absolute -bottom-2 inset-x-0 flex justify-center">
               <span className="bg-[#ff5151] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Score</span>
             </div>
           </div>
           
           <div className="space-y-2">
             <h2 className="text-3xl font-medium text-stone-900">{result.category}</h2>
             <p className="text-stone-500 font-medium text-lg leading-relaxed">{result.commentary}</p>
           </div>
        </div>

        {/* 2. SUGGESTIONS */}
        {result.suggestions.length > 0 && (
          <div className="px-6 space-y-6">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest opacity-40">Quick Fixes</h3>
            <ul className="space-y-4">
              {result.suggestions.map((item, i) => (
                <li key={i} className="flex gap-4 items-start text-stone-700 font-medium text-lg leading-relaxed">
                   <span className="mt-3 w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                   {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. ENHANCE CTA */}
        {enhanceState === null && (
          <div className="bg-stone-900 rounded-4xl p-10 text-center space-y-6 shadow-2xl shadow-stone-200">
            <div className="space-y-2">
              <h3 className="text-2xl font-medium text-white">Want to see perfection?</h3>
              <p className="text-stone-400 font-medium">Let AI refine the lighting and balance.</p>
            </div>
            <PrettyButton 
              onClick={() => { setView("EDIT_ENHANCING"); setEnhanceState('select'); }}
              icon={Sparkles}
            >
              Enhance This Photo
            </PrettyButton>
          </div>
        )}

        {/* 4. ACTIONS */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white p-2 rounded-full border border-stone-200 shadow-2xl shadow-stone-200/50 z-50">
          <Button variant="ghost" className="h-12 w-12 rounded-full hover:bg-stone-50 text-stone-600">
            <Download className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-stone-200" />
          <Button variant="ghost" className="h-12 w-12 rounded-full hover:bg-stone-50 text-stone-600">
            <Share2 className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-stone-200" />
          <Button onClick={reset} variant="ghost" className="h-12 px-6 rounded-full hover:bg-stone-50 text-stone-900 font-medium">
            New Scan
          </Button>
        </div>
      </motion.div>
     );
  };

  return (
    <main className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#ff5151] selection:text-white">
      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="max-w-4xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === "ENTRY" && <EntryScreen key="entry" />}
          {view === "EDIT" && <EditScreen key="edit" />}
          {view === "ANALYZING" && <AnalyzingScreen key="analyzing" />}
          {view === "RESULT" && <ResultScreen key="result" />}
          {view === "EDIT_ENHANCING" && <EditEnhancingScreen key="edit-enhancing" />}
        </AnimatePresence>
      </div>
    </main>
  );
}
