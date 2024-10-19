import { Home, CirclePlus, Play, ChevronUp, CircleUser } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import type { Session } from "next-auth";
import { Button } from "../ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create Quiz",
    url: "/create",
    icon: CirclePlus,
  },
  {
    title: "Play Quiz",
    url: "/play",
    icon: Play,
  },
];

export function AppSidebar({ session }: { session: Session | null }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Logo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="text-lg font-semibold">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/fern.jpg"
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
                  <Link href="/profile">
                    <div className="flex items-center gap-2">
                      <CircleUser />
                      <p className="text-[16px] font-semibold">Profile</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <div>
                  <Button variant={"destructive"} className="w-full">
                    Sign out
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
