
"use client";


import Image from "next/image";
import { Button } from "./ui/button";






export default function CTASection() {
  return (
    <div className="relative py-28 sm:py-20 md:py-32 max-w-6xl mx-auto rounded-none sm:rounded-4xl overflow-hidden">
      <div className="absolute inset-0  -z-10">

        <Image
          src="/sky.webp"
          alt="Background"
          fill
          className="object-cover "
          priority
          draggable={false}
        />
        </div>

      <div className="px-4 sm:px-6 flex flex-col gap-6 sm:gap-8 md:gap-10 items-center text-center">
        <h1 className="z-10 text-3xl leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl sm:leading-snug tracking-tight text-neutral-900 antialiased">
            Let Christmas Feel a
  <br/>
   Little Kinder This Year.
  <span className="font-serif italic"></span>
</h1>



  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
        <Button variant="iosBlack" className="h-10 sm:h-14 w-full sm:w-60 text-lg sm:text-xl px-6 sm:px-8">
          Begin Gently
        </Button>
        </div>
      </div>
    </div>
  );
}
