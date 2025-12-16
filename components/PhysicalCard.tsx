import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PhysicalCard = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Ultra-smooth "luxury" ease
      className="relative w-full max-w-2xl mx-auto perspective-1000"
    >
      {/* THE CARD OBJECT */}
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-500",
          "bg-[#FDFBF7]", // Warm paper color (not stark white)
          "rounded-xs", // Tighter corners for a realistic cardstock look
          // Realistic layered shadow for depth
          "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_24px_-4px_rgba(44,41,34,0.08),0_0_0_1px_rgba(0,0,0,0.02)]"
        )}
      >
        {/* 1. Paper Grain Texture (Noise Overlay) */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* 2. Debossed Edge Detail (The "Pressed" Look) */}
        <div className="absolute inset-4 md:inset-6 border border-stone-900/5 rounded-[1px] pointer-events-none z-10" />

        {/* 3. Content Area */}
        <div className="relative z-20 px-10 py-16 md:px-20 md:py-24 flex flex-col items-center justify-center text-center min-h-[400px]">

          {/* Accent - Minimalist Brand/Stamp */}
          <div className="mb-10 opacity-85y">
            <Image
              src="/pin.svg"
              alt="Pin"
              width={24}
              height={24}
              className="w-16 h-16"
            />
          </div>

          {/* The Message */}
          <p className="font-serif text-xl md:text-2xl leading-[1.8] text-stone-800 tracking-wide whitespace-pre-line antialiased selection:bg-stone-200">
            {text}
          </p>

          {/* Signature Space (Visual balance) */}
          <div className="mt-12 w-8 h-px bg-stone-200" />

        </div>

        {/* 4. Bottom Highlight (Thickness) */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-stone-900/5 z-20" />
      </div>
    </motion.div>
  );
};

export default PhysicalCard;
