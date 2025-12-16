"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  onViewChange,
  currentView = "christmas",
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | React.ComponentType<any>
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  onViewChange?: (view: "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa") => void;
  currentView?: "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa";
}) {
  const getIsActive = (title: string) => {
    if (title === "My Christmas") return currentView === "christmas";
    if (title === "Decor") return currentView === "decor";
    if (title === "Gifts") return currentView === "gifts";
    if (title === "Cards") return currentView === "cards";
    if (title === "Dinner") return currentView === "dinner";
    if (title === "A Note from Santa") return currentView === "santa";
    return false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = getIsActive(item.title);
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.title === "My Christmas" && onViewChange) {
                    onViewChange("christmas");
                  } else if (item.title === "Decor" && onViewChange) {
                    onViewChange("decor");
                  } else if (item.title === "Gifts" && onViewChange) {
                    onViewChange("gifts");
                  } else if (item.title === "Cards" && onViewChange) {
                    onViewChange("cards");
                  } else if (item.title === "Dinner" && onViewChange) {
                    onViewChange("dinner");
                  } else if (item.title === "A Note from Santa" && onViewChange) {
                    onViewChange("santa");
                  } else {
                    window.location.href = item.url;
                  }
                }}
              >
                <div className={`
                  hover:rounded-2xl hover:bg-stone-100 transition-all duration-200 cursor-pointer w-full px-3 py-2 rounded-lg
                  ${isActive ? 'bg-stone-200/70 text-stone-900' : 'text-stone-700 hover:text-stone-900'}
                `}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-stone-700' : 'text-stone-500'} hover:text-stone-600`} />
                  <span className={`font-medium ${isActive ? 'text-stone-900' : 'text-stone-700'} hover:text-stone-900`}>{item.title}</span>
                </div>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
