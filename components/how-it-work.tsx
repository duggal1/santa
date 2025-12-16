import React from 'react';

import { 
  IconUpload, 
  IconSparkles, 
  IconHeartHandshake,
  IconQuote
} from '@tabler/icons-react';

// --- Data ---
const CONTENT = {
  howItWorks: {
    title: "How It Works",
    steps: [
      {
        title: "1. Share a Moment",
        description: "A photo of your room, a list of names, or a simple thought. Just something real from your life.",
        icon: IconUpload
      },
      {
        title: "2. The Quiet Magic",
        description: "AI gently enhances the warmth, writing words that feel human and suggesting gifts that feel known.",
        icon: IconSparkles
      },
      {
        title: "3. A Season Restored",
        description: "You get a plan, a card, or a feeling that fits. Less noise. More of what you actually wanted.",
        icon: IconHeartHandshake
      }
    ]
  },
  centerMessage: {
    title: "A Moment to Pause",
    description: "The world moves quickly, even in December. Let this be a small place where things slow down—where the season feels less like a checklist and more like a feeling you can hold."
  },
santa: {
  title: "A Quiet Note from Santa",
 description:
    "This season has asked more of you than anyone noticed. You kept things moving, kept people comfortable, kept moments from falling apart. That kind of care leaves a mark. If you’re tired, it’s not weakness—it’s proof you showed up. You don’t need to hold everything here. Let this be a small place where you set something down, breathe, and feel supported for a moment.",
  image: "/santa.png"
}


,
  emotionalBridge: {
    title: "Return to Warmth",
    description: "Before the schedules and the pressure, there was just the glow. Let's find that again."
  }
};

// --- Zigzag Divider Component ---
/**
 * Renders a zigzag edge. 
 * @param color - The color of the 'teeth' (The solid part).
 * @param direction - 'up' (teeth point up) or 'down' (teeth point down).
 */
const Zigzag = ({ color, direction = 'down' }: { color: string, direction: 'up' | 'down' }) => (
  <div className="absolute left-0 w-full overflow-hidden leading-[0] z-10" style={{ height: '20px', [direction === 'down' ? 'bottom' : 'top']: '-20px' }}>
    <div 
      className="w-full h-full"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: direction === 'down'
          ? `linear-gradient(135deg, ${color} 25%, transparent 25%), linear-gradient(225deg, ${color} 25%, transparent 25%)`
          : `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(315deg, ${color} 25%, transparent 25%)`,
        backgroundPosition: '0 0',
        backgroundSize: '40px 40px'
      }}
    />
  </div>
);

export default function Howitworks (){
  return (
    <div className="w-full bg-white font-sans text-stone-800">
      <section className="relative w-full bg-white py-20 sm:py-24 md:py-40 mt-8 sm:mt-10 px-4 sm:px-6 flex justify-center items-center">
        {/* Top Zigzag: Green teeth pointing UP into the Green section */}
        <div className="absolute -top-5 left-0 w-full h-5 z-10">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(45deg, #e6f4ea 25%, transparent 25%), linear-gradient(315deg, #e6f4ea 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>
        <div className="max-w-3xl text-center">
          <div className="mb-6 sm:mb-8 flex justify-center text-stone-300">
            <img src="/Quote.svg" alt="Quote" className="w-10 h-10 sm:w-12 md:w-18 rotate-180" />
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl antialiased font-medium text-stone-900 mb-4 sm:mb-6 md:mb-8">
            {CONTENT.centerMessage.title}
          </h3>
          <p className="text-base sm:text-lg md:text-2xl text-stone-500 antialiased font-light leading-relaxed sm:leading-loose">
            {CONTENT.centerMessage.description}
          </p>
        </div>

        {/* Bottom Zigzag: Snowy teeth pointing DOWN into the Snowy section */}
        <div className="absolute -bottom-5 left-0 w-full h-5 z-10">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(135deg, #f1f5f9 25%, transparent 25%), linear-gradient(225deg, #f1f5f9 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>
      </section>

      {/* =========================================
          SECTION 1: HOW IT WORKS (GREEN THEME)
      ========================================= */}
      <section className="relative w-full bg-[#e6f4ea] py-12 sm:py-16 md:py-32">
        {/* Top Zigzag: Matches the page background above (Cream/White) biting INTO the green */}
        {/* We simulate this by having Green teeth pointing UP */}
        <div className="absolute -top-5 left-0 w-full h-5">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(45deg, #e6f4ea 25%, transparent 25%), linear-gradient(315deg, #e6f4ea 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-20">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-neutral-950 mb-4 sm:mb-6 tracking-tight">
              {CONTENT.howItWorks.title}
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
            {CONTENT.howItWorks.steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="w-12 h-12 sm:w-16 md:w-20 rounded-full bg-black text-[#9effba] flex items-center justify-center mb-4 sm:mb-6 md:mb-8 shadow-lg shadow-green-900/10 transition-transform duration-500 group-hover:scale-105">
                    <Icon size={28} stroke={1} className="sm:size-8 md:sm:w-9 md:sm:h-9" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-[#00230d] mb-2 sm:mb-3 md:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#1e4a2e]/70 leading-relaxed max-w-sm sm:max-w-xs text-sm sm:text-base md:text-lg">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Zigzag: Green teeth pointing DOWN into the next White section */}
        <div className="absolute -bottom-5 left-0 w-full h-5 z-10">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(135deg, #e6f4ea 25%, transparent 25%), linear-gradient(225deg, #e6f4ea 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>
      </section>


      {/* =========================================
          SECTION 2: MOMENT TO PAUSE (WHITE)
      ========================================= */}
      

      

      {/* =========================================
          SECTION 3: SANTA'S NOTE (SNOWY)
      ========================================= */}
      <section className="relative w-full bg-[#f1f5f9] py-12 sm:py-16 md:py-32">
        {/* Top Zigzag: Snowy teeth pointing UP into the White section */}
        <div className="absolute -top-5 left-0 w-full h-5 z-10">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(315deg, #f1f5f9 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-16 lg:gap-24">

            {/* Image Side */}
            <div className="w-full md:w-1/2 relative">
               <div className="relative z-10 ">
                 <img
                   src={CONTENT.santa.image}
                   alt="Classic Santa"
                   className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105  transition-all duration-700 rounded-xl sm:rounded-2xl md:rounded-none"
                 />
               </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 text-left">

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-stone-800 mb-4 sm:mb-6 md:mb-8 leading-tight">
                {CONTENT.santa.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-stone-600 leading-relaxed font-light">
                {CONTENT.santa.description}
              </p>
              <div className="mt-6 sm:mt-8 md:mt-10 font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone-400 italic">
                - S.C.
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Zigzag: Snowy teeth pointing DOWN into the next White section */}
        <div className="absolute -bottom-5 left-0 w-full h-5 z-10">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(135deg, #f1f5f9 25%, transparent 25%), linear-gradient(225deg, #f1f5f9 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>
      </section>


      {/* =========================================
          SECTION 4: EMOTIONAL BRIDGE (WHITE)
      ========================================= */}
      <section className="relative w-full bg-white py-12 sm:py-16 md:py-32 px-4 sm:px-6 text-center">
        {/* Top Zigzag: Snowy teeth pointing UP into the Snowy section */}
        <div className="absolute -top-5 left-0 w-full h-5 z-10">
            <div className="w-full h-full" style={{
                backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(315deg, #f1f5f9 25%, transparent 25%)`,
                backgroundSize: '40px 40px'
            }} />
        </div>


      </section>

    </div>
  );
};
