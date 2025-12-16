"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowUpRight, IconX } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full
          transition-all bg-transparent duration-300 ease-out
          ${scrolled
            ? "backdrop-blur-2xl bg-white/5"
            : "bg-transparent"}
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-1">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="relative w-16 h-16 md:w-22 md:h-22 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Christmas AI"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-stone-900 italic font-serif font-light tracking-tight text-xl md:text-3xl">
                Christmas AI
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              <Link
                href="/how-it-works"
                className="text-stone-600 text-sm font-medium hover:text-stone-950 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/features"
                className="text-stone-700 text-sm font-medium hover:text-stone-900 transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/about"
                className="text-stone-700 text-sm font-medium hover:text-stone-900 transition-colors"
              >
                Our Intention
              </Link>

            <Link
            href={isSignedIn ? "/dashboard" : "/auth/signup"}>


            <Button

   variant={"pretty"}
     className="
              relative inline-flex items-center justify-center gap-2
h-10 px-6 rounded-full font-medium text-base whitespace-nowrap
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
      <span className="relative z-10">
        {isSignedIn ? "Go to My Christmas" : "Begin Gently"}
      </span>
      <div className="bg-white text-[#e65a5a] size-6 overflow-hidden rounded-full">
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
      </Link>
    </nav>
            
            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <motion.div
                  className="absolute top-0 left-0 w-6 h-[1.5px] bg-stone-800 rounded-full"
                  animate={{
                    rotate: open ? 45 : 0,
                    y: open ? 9 : 0,
                    filter: "blur(0px)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                    mass: 1.8,
                    bounce: 0.02,
                    restDelta: 0.001,
                    duration: 0.8
                  }}
                />
                <motion.div
                  className="absolute top-[9px] left-0 w-6 h-[1.5px] bg-stone-800 rounded-full"
                  animate={{
                    opacity: open ? 0 : 1,
                    scale: open ? 0.8 : 1,
                    filter: "blur(0px)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                    mass: 1.8,
                    opacity: { duration: 0.6 },
                    scale: { duration: 0.5 },
                    restDelta: 0.001
                  }}
                />
                <motion.div
                  className="absolute top-[18px] left-0 w-6 h-[1.5px] bg-stone-800 rounded-full"
                  animate={{
                    rotate: open ? -45 : 0,
                    y: open ? -9 : 0,
                    filter: "blur(0px)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                    mass: 1.8,
                    bounce: 0.02,
                    restDelta: 0.001,
                    duration: 0.8
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(15px)",
              backdropFilter: "blur(20px)"
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              backdropFilter: "blur(25px)"
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(15px)",
              backdropFilter: "blur(20px)"
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 1.2,
              bounce: 0.05,
              filter: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
              backdropFilter: { duration: 0.6 }
            }}
            className="md:hidden fixed inset-0 z-40 backdrop-blur-2xl bg-white/90"
            onClick={() => setOpen(false)}
          >
            <div className="px-6 pt-24 pb-10 h-full flex flex-col">
              <motion.nav
                className="flex flex-col gap-6 flex-1"
                initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.15,
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                  filter: { duration: 0.3 }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(3px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.25,
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                    filter: { duration: 0.2 }
                  }}
                >
                  <Link
                    href="/how-it-works"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                    }}
                    className="text-stone-700 text-xl font-medium py-3 px-4 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-all min-h-[48px] flex items-center"
                  >
                    How It Works
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(3px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.3,
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                    filter: { duration: 0.2 }
                  }}
                >
                  <Link
                    href="/features"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                    }}
                    className="text-stone-700 text-xl font-medium py-3 px-4 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-all min-h-[48px] flex items-center"
                  >
                    Explore
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(3px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.35,
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                    filter: { duration: 0.2 }
                  }}
                >
                  <Link
                    href="/about"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);
                    }}
                    className="text-stone-700 text-xl font-medium py-3 px-4 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-all min-h-[48px] flex items-center"
                  >
                    Our Intention
                  </Link>
                </motion.div>
              </motion.nav>

              {/* Mobile CTA */}
              <motion.div
                className="mt-auto"
                initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.45,
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                  filter: { duration: 0.3 }
                }}
              >
                <Link
                  href={isSignedIn ? "/dashboard" : "/auth/signup"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                >
                  <Button
                    variant={"pretty"}
                    className="
                      relative inline-flex items-center justify-center gap-2
                      h-12 px-8 rounded-full font-medium text-lg whitespace-nowrap
                      text-white bg-[#ff5151] border border-[#cf4f4f]
                      shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]
                      transition-all duration-150 ease-out
                      overflow-hidden isolate cursor-pointer group
                      before:absolute before:inset-0 before:rounded-full
                      before:bg-linear-to-b before:from-white/35 before:to-transparent before:opacity-40
                      before:transition-all before:duration-150
                      hover:bg-[#ff3434]
                      hover:before:opacity-65
                      hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.55)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#e03636]/60
                      active:scale-[0.98]
                      disabled:pointer-events-none disabled:opacity-50
                      w-full
                    "
                  >
                    <span className="relative z-10">
                      {isSignedIn ? "Go to My Christmas" : "Begin Gently"}
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
