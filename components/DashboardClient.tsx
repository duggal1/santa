"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ChristmasVibeJudge from "@/components/dashbaord/christmas"
import DecorAnalysis from "@/components/decor-analysis"
import Gifts from "@/components/gifts"
import Dinner from "@/components/dinner"
import Cards from "@/components/cards"
import Santa from "@/components/santa"

type ViewType = "christmas" | "decor" | "gifts" | "dinner" | "cards" | "santa";

export default function DashboardClient() {
  const [currentView, setCurrentView] = useState<ViewType>("christmas");

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case "christmas":
        return "Christmas AI";
      case "decor":
        return "Decor Analysis";
      case "gifts":
        return "Gifts";
      case "dinner":
        return "Dinner";
      case "cards":
        return "Cards";
      case "santa":
        return "Note from Santa";
      default:
        return "Dashboard";
    }
  };

  // Listen for custom events from sidebar navigation
  React.useEffect(() => {
    const handleViewChange = (event: CustomEvent<ViewType>) => {
      setCurrentView(event.detail);
    };

    window.addEventListener('changeView', handleViewChange as EventListener);
    return () => window.removeEventListener('changeView', handleViewChange as EventListener);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case "decor":
        return <DecorAnalysis />;
      case "gifts":
        return <Gifts />;
      case "dinner":
        return <Dinner />;
      case "cards":
        return <Cards />;
      case "santa":
        return <Santa />;
      case "christmas":
      default:
        return <ChristmasVibeJudge />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onViewChange={setCurrentView} currentView={currentView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList className="text-stone-800 antialiased">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-stone-800 hover:text-stone-600 antialiased">
                    Christmas AI
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-stone-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-stone-800 font-medium antialiased">
                    {getBreadcrumbTitle()}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
