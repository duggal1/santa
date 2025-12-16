"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const SECTION_DATA = {
  title: "See Your Christmas Become More Beautiful",
  description:
    "Your space stays yours—AI simply refines the light, warmth, and details, helping your home feel more elegant, cozy, and quietly festive this season.",
  comparisons: [
    {
      id: "first-pair",
      original: "/this-image1.avif",
      refined: "/that-image1.avif",
    },
    {
      id: "second-pair",
      original: "/this-image2.avif",
      refined: "/that-image2.avif",
    },
  ],
};

export default function ThisThat() {
  return (
    <section className="w-full bg-neutral-50 py-20 sm:py-32 overflow-hidden border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28 px-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-neutral-900 leading-[1.15] mb-6"
          >
            {SECTION_DATA.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-neutral-600 font-sans text-sm sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto antialiased font-light"
          >
            {SECTION_DATA.description}
          </motion.p>
        </div>

        {/* Comparison Rows */}
        <div className="space-y-24 sm:space-y-36">
          {SECTION_DATA.comparisons.map((item, index) => (
            <div 
              key={item.id} 
              className="relative flex flex-col lg:flex-row items-center justify-center gap-10 sm:gap-12 lg:gap-16"
            >
              
              {/* Left Image (Original) - Tilts Left naturally, deeper on hover */}
              <motion.div
                className="relative group w-full max-w-lg perspective-1000"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 50, damping: 20, duration: 0.8 }}
              >
                {/* Badge */}
                <div className="absolute top-5 left-5 z-20 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-neutral-200/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 shadow-sm pointer-events-none">
                  Original
                </div>

                <motion.div
                  className="relative aspect-[4/5] sm:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/40 bg-neutral-200"
                  initial={{ rotate: -2 }} // Natural Default Tilt
                  whileHover={{ scale: 1.03, rotate: -4, y: 5 }} // Intense Hover
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={item.original}
                    alt="Original Christmas Space"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={95}
                  />
                  {/* Overlay for depth */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>
              </motion.div>


              {/* Center Arrow Indicator */}
              <motion.div
                className="z-10 shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-neutral-100 transform rotate-90 lg:rotate-0 transition-transform duration-500">
                  {/* Custom Requested SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    color="currentColor"
                    fill="currentColor"
                    stroke="none"
                    className="text-stone-300"
                  >
                    <path d="M13 8.5H13.5V4.69635C13.5 4.31176 13.8118 4 14.1963 4C14.39 4 14.5749 4.08062 14.7066 4.22252L20.6598 10.6336C20.8785 10.8691 21 11.1786 21 11.5C21 11.8214 20.8785 12.1309 20.6598 12.3664L14.7066 18.7775C14.5749 18.9194 14.39 19 14.1963 19C13.8118 19 13.5 18.6882 13.5 18.3037V14.5C7.94555 14.5 4.94688 18.5162 4.19199 19.6847C4.06738 19.8776 3.85713 20 3.6275 20C3.28094 20 3 19.7191 3 19.3725V18.5C3 12.9772 7.47715 8.5 13 8.5Z" />
                  </svg>
                </div>
              </motion.div>


              {/* Right Image (Refined) - Tilts Right naturally, deeper on hover */}
              <motion.div
                className="relative group w-full max-w-lg perspective-1000"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 50, damping: 20, duration: 0.8, delay: 0.1 }}
              >
                {/* Badge */}
                <div className="absolute top-5 right-5 z-20 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-neutral-200/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-700 shadow-sm pointer-events-none">
                  Refined
                </div>

                <motion.div
                  className="relative aspect-[4/5] sm:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/40 bg-neutral-200"
                  initial={{ rotate: 2 }} // Natural Default Tilt
                  whileHover={{ scale: 1.03, rotate: 4, y: -5 }} // Intense Hover
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={item.refined}
                    alt="Refined Christmas Space"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={95}
                  />
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              </motion.div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
