import React from 'react';
import {
  IconChristmasTree,
  IconGift,
  IconPhotoHeart,
  IconToolsKitchen2,
  IconSnowflake
} from '@tabler/icons-react';

// --- Data & Types ---

type FeatureKey = 'decor' | 'gifts' | 'cards' | 'dinner';

interface SectionData {
  title: string;
  description: string;
  icon: React.ElementType;
}

const CONTENT: {
  sections: Record<FeatureKey, SectionData>;
  finalCTA: { title: string; button: string };
  footer: { description: string };
} = {
  sections: {
    decor: {
      title: "See Your Space the Way You Hoped It Would Feel",
      description: "Share a photo of your tree or room, and AI subtly enhances the warmth, softness, and spirit behind your decorations. Not to judge—just to help your space look the way it felt in your imagination.",
      icon: IconChristmasTree,
    },
    gifts: {
      title: "Find Gifts That Carry Real Thought Behind Them",
      description: "Tell us who you're gifting and what they mean to you. AI offers heartfelt suggestions that feel personal, attentive, and quietly perfect—ideas chosen with the kind of care people remember.",
      icon: IconGift,
    },
    cards: {
      title: "Create Cards That Hold Real Emotion, Not Templates",
      description: "Upload a moment that matters, and AI turns it into a soft, sincere Christmas card—gentle colors, warm light, and words that feel human. Something worth sending, something worth keeping.",
      icon: IconPhotoHeart,
    },
    dinner: {
      title: "Make Christmas Dinner Feel Less Heavy on You",
      description: "Share your guests, your budget, and your comfort in the kitchen. AI builds a calm, steady dinner plan with timing, menus, and a simple flow—so the evening feels peaceful, not overwhelming.",
      icon: IconToolsKitchen2,
    },
  },
  finalCTA: {
    title: "Let This Christmas Feel Softer, Even Just a Little",
    button: "Start the Experience",
  },
  footer: {
    description: "For anyone who wants a holiday that feels warm, grounded, and human again—without the rush, the noise, or the pressure. Just a little help to make the season easier to hold.",
  },
};

// --- Helper Components ---

/**
 * Pure CSS Zigzag Divider
 * Uses gradients to create a "tooth" pattern without images/SVGs.
 * @param color - The color of the "teeth" (should match the adjacent section background)
 * @param position - 'top' points up (placed at top of container), 'bottom' points down.
 */
const ZigzagDivider = ({ 
  colorClass = "from-[#fffaf0] to-[#fffaf0]", // Using gradient stops for color mapping
  position = "top" 
}: { 
  colorClass?: string; 
  position?: "top" | "bottom" 
}) => {
  return (
    <div className={`absolute left-0 w-full h-4 z-10 ${position === 'top' ? '-top-4' : '-bottom-4'}`}>
      <div 
        className={`w-full h-full bg-gradient-to-tr ${colorClass}`}
        style={{
            // Creating the zigzag pattern purely with CSS gradients
            background: position === 'top' 
                ? `linear-gradient(135deg, currentColor 25%, transparent 25%) -10px 0,
                   linear-gradient(225deg, currentColor 25%, transparent 25%) -10px 0,
                   linear-gradient(315deg, transparent 75%, transparent 75%) 0 0,
                   linear-gradient(45deg, transparent 75%, transparent 75%) 0 0`
                : `linear-gradient(135deg, transparent 75%, currentColor 75%) -10px 0,
                   linear-gradient(225deg, transparent 75%, currentColor 75%) -10px 0`,
            backgroundSize: '20px 20px',
            backgroundColor: 'transparent', 
            color: '#fffaf0' // This matches the page background (Cream)
        }}
      />
    </div>
  );
};

const FeatureCard = ({ data }: { data: SectionData }) => {
  const Icon = data.icon;
  return (
    <div className="group flex flex-col items-start p-6 sm:p-8 transition-opacity duration-500 hover:opacity-80">
      <div className="mb-6 inline-flex items-center justify-center p-3 rounded-full bg-black text-rose-400">
        <Icon size={28} stroke={1.2} />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl text-stone-800 leading-snug mb-4">
        {data.title}
      </h3>
      <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed max-w-sm">
        {data.description}
      </p>
    </div>
  );
};

// --- Main Layout Component ---

export default function Features (){
  return (
    <div className="min-h-screen w-full ">
      
      {/* 1. Subtle Header Spacer */}
      

      {/* 2. Main Product Section (Red Background) */}
      <section className="relative w-full bg-[#ffe0e2] py-16 sm:py-32">
        {/* Top Zigzag Border: Visual transition from Cream -> Red */}
        {/* We actually render the 'Cream' teeth pointing DOWN into the red section at the top */}
      
        <div
            className="absolute top-0 left-0 w-full h-6 z-10"
            style={{
                background: `
                    linear-gradient(135deg, #fffaf0 25%, transparent 25%) -15px 0,
                    linear-gradient(225deg, #fffaf0 25%, transparent 25%) -15px 0
                `,
                backgroundSize: '30px 30px'
            }}
        />

        <div className="flex justify-center items-center flex-col text-center mb-12 sm:mb-20">
          <div className="mb-4 text-rose-900 animate-pulse">
            <IconSnowflake size={24} stroke={1} />
          </div>
          <h1 className="font-serif text-stone-800 text-4xl sm:text-6xl tracking-tight px-4">
            The Holiday Collection
          </h1>
          <p className="mt-4 text-stone-500 text-lg font-light max-w-md mx-auto px-6">
            Tools designed to bring the quiet back into your Christmas.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 lg:gap-y-24">
            <FeatureCard data={CONTENT.sections.decor} />
            <FeatureCard data={CONTENT.sections.gifts} />
            <FeatureCard data={CONTENT.sections.cards} />
            <FeatureCard data={CONTENT.sections.dinner} />
          </div>
        </div>

        {/* Bottom Zigzag Border: Visual transition from Red -> Cream */}
        {/* We render Cream teeth pointing UP into the red section at the bottom */}
        <div 
            className="absolute bottom-0 left-0 w-full h-6 z-10"
            style={{
                background: `
                    linear-gradient(315deg, #fffaf0 25%, transparent 25%) -15px 0,
                    linear-gradient(45deg, #fffaf0 25%, transparent 25%) -15px 0
                `,
                backgroundSize: '30px 30px'
            }}
        />
      </section>
            

    
     

    
    </div>
  );
};
