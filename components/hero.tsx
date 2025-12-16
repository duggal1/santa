"use client";

import Link from "next/link";
import { IconArrowUpRight, IconSparkles } from "@tabler/icons-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

interface ButtonProps {
  label: string;
}

const GradientButton: React.FC<ButtonProps> = ({ label }) => {
  return (
    <Button
      variant={"pretty"}
      className="
              relative inline-flex items-center justify-center gap-2
h-10 sm:h-12 px-8 sm:px-6 rounded-full font-medium text-lg sm:text-base whitespace-nowrap
text-white bg-[#ff5151] border border-[#cf4f4f]
shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]
transition-all duration-150 ease-out
overflow-hidden isolate cursor-pointer group
before:absolute before:inset-0 before:rounded-full
before:bg-linear-to-b before:from-white/35 before:to-transparent before:opacity-40
before:transition-all before:duration-150

hover:bg-[#ff3434]              /* toned-down cranberry */
hover:before:opacity-65
hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.55)]

focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[#e03636]/60

active:scale-[0.98]
disabled:pointer-events-none disabled:opacity-50



                "
    >
      <span className="relative z-10">{label}</span>
      <div className="bg-white text-[#ff5151] size-6 overflow-hidden rounded-full">
        <div className="flex w-12 transition-transform duration-500 ease-in-out translate-x-0 group-hover:-translate-x-6">
          <span className="flex size-6 items-center justify-center">
            <IconArrowUpRight className="size-4" />
          </span>
          <span className="flex size-6 items-center justify-center">
            <IconArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Button>
  );
};

const WhiteButton: React.FC<ButtonProps> = ({ label }) => {
  return (
    <Button
      variant={"ios"}
        className="
              relative  inline-flex items-center justify-center gap-2
h-10 sm:h-12 px-8 sm:px-6 rounded-full font-medium text-lg sm:text-base whitespace-nowrap
text-stone-800 bg-white border border-stone-200
shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]
transition-all duration-150 ease-out
overflow-hidden isolate cursor-pointer group
before:absolute before:inset-0 before:rounded-full
before:bg-linear-to-b before:from-white/35 before:to-transparent before:opacity-40
before:transition-all before:duration-150

hover:bg-stone-200           /* toned-down cranberry */
hover:before:opacity-65
hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.55)]

focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[#e03636]/60

active:scale-[0.98]
disabled:pointer-events-none disabled:opacity-50



                "
    
    >
      <span className="relative z-10">{label}</span>
      <div className="bg-[#ff5151] text-white size-6 overflow-hidden rounded-full">
        <div className="flex w-12 transition-transform duration-500 ease-in-out translate-x-0 group-hover:-translate-x-6">
          <span className="flex size-6 items-center justify-center">
            <IconArrowUpRight className="size-4" />
          </span>
          <span className="flex size-6 items-center justify-center">
            <IconArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Button>
  );
};

export default function Hero() {
  const { isSignedIn } = useAuth();
 

  return (
    <div className="relative text-neutral-800 py-16 sm:py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8 md:gap-10 items-center text-center">
        {/* Eyebrow */}


        <h1 className="z-10 flex flex-wrap items-baseline justify-center gap-2 text-4xl leading-[1.1] sm:text-4xl md:text-6xl lg:text-6xl font-medium tracking-tight text-neutral-950 antialiased">
          A Quiet Touch of AI <br className="hidden sm:block" />
          to Light Your Christmas.
        </h1>

        <p className="hidden sm:block text-neutral-700 antialiased z-10 font-medium text-sm sm:text-lg md:text-lg leading-relaxed tracking-normal max-w-2xl px-2 sm:px-0">
  Four gentle tools to ease holiday stress—warming your home, guiding
  thoughtful gifts, and helping your moments feel calmer, softer, and
  more your own.
</p>

<p className="block sm:hidden text-neutral-700 antialiased z-10 font-medium text-sm leading-relaxed tracking-normal max-w-xl px-2">
 Gentle tools to make Christmas feel calmer, easier, and less heavy.

</p>


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
          <Link
            href={isSignedIn ? "/dashboard" : "/auth/signup"}
            className="cursor-pointer w-full sm:w-auto"
          >
            <GradientButton
              label={isSignedIn ? "Go to My Christmas" : "Begin With Ease"}
            />
          </Link>
          {/* <WhiteButton label="Take a Look" /> */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl sm:rounded-3xl mt-8 sm:mt-10 md:mt-12 relative overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 h-56 sm:h-64 md:h-96 lg:h-[600px]">
          <Image
            src="/image.png"
            alt="app screen"
            fill
            draggable={false}
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
