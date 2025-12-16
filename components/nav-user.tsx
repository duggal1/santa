"use client"

import { useUser, useClerk } from '@clerk/nextjs';
import {
  Logout01Icon,
  Invoice01Icon,
  Notification01Icon,
  ZapIcon,
  UserMultipleIcon,
} from "hugeicons-react"
import {
  ChevronsUpDown,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from 'react';

function extractNameFromEmail(email: string): string {
  if (!email) return 'User';

  // Get the part before '@'
  const [localPart] = email.split('@');

  // Split on dots and underscores, take first meaningful part
  const parts = localPart.split(/[._-]/).filter(part => part.length > 0);

  // Capitalize first letter
  const firstName = parts[0] || 'User';
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

export function NavUser({
  user: fallbackUser,
}: {
  user?: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { isMobile } = useSidebar()
  const [displayName, setDisplayName] = useState<string | null>(null);

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  // Fetch display name from database
  useEffect(() => {
    if (clerkUser?.id) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.displayName) {
            setDisplayName(data.displayName);
          }
        })
        .catch(err => console.error('Failed to fetch display name:', err));
    }
  }, [clerkUser?.id]);

  // Use display name from database, then Clerk user data, then fallback
  const user = clerkUser ? {
    name: displayName || (clerkUser.firstName && clerkUser.lastName ? `${clerkUser.firstName} ${clerkUser.lastName}` : clerkUser.username || extractNameFromEmail(clerkUser.primaryEmailAddress?.emailAddress || '')),
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    avatar: clerkUser.imageUrl || '',
  } : fallbackUser || {
    name: 'User',
    email: '',
    avatar: '',
  };

  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="h-8 w-8 rounded-lg bg-zinc-200" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-24 bg-zinc-200" />
              <Skeleton className="h-3 w-32 bg-zinc-200" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:rounded-xl hover:bg-zinc-200/70 transition-all duration-200"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium font-sans text-stone-950 antialiased text-lg">{user.name}</span>
                <span className="truncate text-xs antialiased text-neutral-500 ">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl border-stone-200 shadow-lg bg-white/95 backdrop-blur-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium ">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-stone-100! hover:text-stone-900! hover:rounded-2xl transition-all duration-200 p-3">
                <ZapIcon className="size-4 text-rose-400 fill-rose-400" />
                <span className="font-medium text-stone-900 antialiased">Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-stone-100! hover:text-stone-900! hover:rounded-2xl transition-all duration-200 p-3">
                <UserMultipleIcon className="size-4 text-stone-600" />
                <span className="font-medium text-stone-900 antialiased">Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-stone-100! hover:text-stone-900! hover:rounded-2xl transition-all duration-200 p-3">
                <Invoice01Icon className="size-4 text-stone-600" />
                <span className="font-medium text-stone-900 antialiased">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-stone-100! hover:text-stone-900! hover:rounded-2xl transition-all duration-200 p-3">
                <Notification01Icon className="size-4 text-stone-600" />
                <span className="font-medium text-stone-900 antialiased">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-stone-100! hover:text-stone-900! hover:rounded-2xl transition-all duration-200 p-3 cursor-pointer"
            >
              <Logout01Icon className="size-4 text-stone-600" />
              <span className="font-medium text-stone-900 antialiased">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
