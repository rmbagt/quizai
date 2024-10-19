"use client";

import * as React from "react";
import { CirclePlus, Home, Save } from "lucide-react";
import { NavMain } from "~/components/layout/nav-main";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronUp, CircleUser } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "~/components/ui/sidebar";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/app/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Create Quiz",
      url: "/app/create",
      icon: CirclePlus,
      isActive: true,
    },
    {
      title: "Saved Quiz",
      url: "/app/quiz",
      icon: Save,
      isActive: true,
    },
  ],
};

export function AppSidebar({
  session,
  ...props
}: {
  props?: React.ComponentProps<typeof Sidebar>;
  session?: Session | null;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2">
                    <Image
                      src={session?.user?.image ?? ""}
                      alt="profile"
                      className="h-[24px] w-[24px] overflow-hidden rounded-full"
                      width={24}
                      height={24}
                    />
                    <p className="text-[16px] font-semibold">
                      {session?.user?.name}
                    </p>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="flex w-[--radix-popper-anchor-width] flex-col gap-2 p-2"
              >
                <DropdownMenuItem>
                  <Link href="/app/profile">
                    <div className="flex items-center gap-2">
                      <CircleUser />
                      <p className="text-[16px] font-semibold">Profile</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <Link
                  href={
                    session
                      ? "/api/auth/signout?callbackUrl=/"
                      : "/api/auth/signin"
                  }
                >
                  <div>
                    <Button className="w-full">
                      {session ? "Sign Out" : "Sign In"}
                    </Button>
                  </div>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
