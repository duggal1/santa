"use client";

import * as React from "react";
import Image from "next/image";
import {
  Home01Icon,
  GiftIcon,
  SparklesIcon,
KitchenUtensilsIcon,
FavouriteIcon,
Tag01Icon,
Cards02Icon,
} from "hugeicons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/* ---------------------------
   DATA — SIMPLE & HUMAN
---------------------------- */

const data = {
  user: {
    name: "You",
    email: "you@example.com",
    avatar: "/avatars/user.jpg",
  },

  navMain: [
    {
      title: "My Christmas",
      url: "/home",
      icon: Home01Icon,
      isActive: true,
    },
    {
      title: "Decor",
      url: "/decor",
      icon: Tag01Icon,
    },
    {
      title: "Gifts",
      url: "",
      icon: GiftIcon,
    },
    {
      title: "Cards",
      url: "",
      icon: Cards02Icon,
    },
    {
      title: "Dinner",
      url: "",
      icon: KitchenUtensilsIcon,
    },
  ],

  navSecondary: [
    {
      title: "A Note from Santa",
      url: "/santa",
      icon: FavouriteIcon,
      iconClassName: "text-rose-400 fill-rose-400",
    },
  ],
};

/* ---------------------------
   SIDEBAR COMPONENT
---------------------------- */

export function AppSidebar({
  onViewChange,
  currentView,
  ...sidebarProps
}: React.ComponentProps<typeof Sidebar> & {
  onViewChange?: (view: "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa") => void;
  currentView?: "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa";
}) {
  return (
    <Sidebar variant="inset" {...sidebarProps}>
      {/* Header */}
     <SidebarHeader>
  <div className="flex items-center  gap-1 px-4 py-0">
    <div className="relative w-12 h-12 shrink-0">
      <Image
        src="/logo.png"
        alt="Christmas AI"
       height={200}
       width={200}
        className="object-contain"
        priority
      />
    </div>

    <span className="text-zinc-900 italic font-serif font-light tracking-tight text-xl leading-none">
      Christmas AI
    </span>
  </div>
</SidebarHeader>

      {/* Main Content */}
      <SidebarContent>
        <NavMain items={data.navMain} onViewChange={onViewChange} currentView={currentView} />
        <NavSecondary items={data.navSecondary} onViewChange={onViewChange} currentView={currentView} className="mt-auto" />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
