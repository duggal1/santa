import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  onViewChange,
  currentView = "christmas",
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | React.ComponentType<any>
    iconClassName?: string
  }[]
  onViewChange?: (view: "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa") => void;
  currentView?: "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa";
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const getIsActive = (title: string) => {
    if (title === "A Note from Santa") return currentView === "santa";
    return false;
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = getIsActive(item.title);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.title === "A Note from Santa" && onViewChange) {
                      onViewChange("santa");
                    } else {
                      window.location.href = item.url;
                    }
                  }}
                  className={`hover:rounded-xl hover:bg-zinc-200/70 transition-all duration-200 ${
                    isActive ? 'bg-zinc-200/70 text-zinc-900' : ''
                  }`}
                >
                  <item.icon className={`text-zinc-500 hover:text-zinc-400 ${item.iconClassName || ''} ${
                    isActive ? 'text-zinc-700' : ''
                  }`} />
                  <span className={`font-medium hover:text-zinc-700 ${
                    isActive ? 'text-zinc-900' : 'text-zinc-900'
                  }`}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
