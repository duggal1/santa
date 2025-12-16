"use client";

import Link from "next/link";
import Image from "next/image";

// --- Data ---
const footerData = {
  about: {
    productName: "Christmas AI",
    description:
      "A small collection of gentle tools made to ease the season—helping your home feel warmer, your gifts feel thoughtful, and your moments feel calmer."
  },

  sections: {
    product: {
      title: "Explore",
      links: [
        { label: "How It Works", url: "/how-it-works" },
        { label: "Decor & Gifts", url: "/features" },
        { label: "Dinner Planning", url: "/dinner" },
        { label: "Create a Card", url: "/cards" }
      ]
    },

    resources: {
      title: "Learn",
      links: [
        { label: "Holiday Guide", url: "/guide" },
        { label: "Thoughtful Gifting", url: "/gifting" },
        { label: "Support", url: "/support" }
      ]
    },

    company: {
      title: "About",
      links: [
        { label: "Our Intention", url: "/about" },
        { label: "Contact", url: "/contact" },
        { label: "Privacy", url: "/privacy" },
        { label: "Terms", url: "/terms" }
      ]
    },
  },

  tagline: "A quieter, kinder way to experience Christmas.",
  copyright: "© 2025 Christmas AI. All rights reserved."
};



export default function Footer() {
  return (
    <footer className="bg-white py-8 sm:py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="bg-stone-100 rounded-3xl sm:rounded-4xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-12 lg:p-16 border border-stone-50">

          {/* Top Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-12">

            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-16 h-16 sm:w-16 md:w-24 md:h-24 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Christmas AI"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-stone-900 italic font-serif font-light tracking-tight text-2xl sm:text-2xl md:text-3xl">
                Christmas AI
              </span>
            </div>

            {/* Socials */}
            <div className="flex gap-4 sm:gap-5 mt-6 sm:mt-0">
              {/* <Link
                href="#"
                className="group p-1.5 sm:p-2 bg-white rounded-full border border-[#DCCFC3] hover:border-[#eb3b3b] transition-all duration-300"
              >
                <Image src="/globe.svg" alt="Website" width={16} height={16} className="sm:w-4.5 sm:h-4.5 opacity-60 group-hover:opacity-100" />
              </Link> */}
            </div>
          </div>

          {/* Description (kept high, nav pushed lower) */}
          <div className="max-w-xl mb-8 sm:mb-12 md:mb-20">
            <p className="text-[#6A6058] text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              {footerData.about.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 sm:gap-y-10 gap-x-6 sm:gap-x-8 mb-8 sm:mb-12 md:mb-16">

            {Object.values(footerData.sections).map((section, idx) => (
              <div key={idx} className="flex flex-col space-y-4 sm:space-y-5">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#6A6058]">
                  {section.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.url}
                        className="text-sm sm:text-[15px] md:text-base font-medium text-[#2E2A26] hover:text-[#eb3b3b] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Bottom */}
          <div className="border-t border-[#DCCFC3] pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center md:text-left">
            <p className="text-xs sm:text-sm font-medium text-[#6A6058]">
              {footerData.copyright}
            </p>
            <p className="text-xs sm:text-sm font-medium text-[#6A6058] block">
              {footerData.tagline}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
