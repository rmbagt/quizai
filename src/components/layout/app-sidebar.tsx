"use client";

import * as React from "react";
import { CirclePlus, Home, Save } from "lucide-react";
import { NavMain } from "~/components/layout/nav-main";
import { NavUser } from "~/components/layout/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "~/components/ui/sidebar";
import type { Session } from "next-auth";

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
        {session?.user && (
          <NavUser
            user={{
              name: session.user.name ?? "Unknown",
              email: session.user.email ?? "Unknown",
              image: session.user.image ?? "/fern.jpg",
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
