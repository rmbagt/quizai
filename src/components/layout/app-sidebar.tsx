import {
  Home,
  CirclePlus,
  Play,
  ChevronUp,
  CircleUser,
  Save,
} from "lucide-react";
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
    url: "/app/",
    icon: Home,
  },
  {
    title: "Create Quiz",
    url: "/app/create",
    icon: CirclePlus,
  },
  {
    title: "Saved Quiz",
    url: "/quiz",
    icon: Save,
  },
  {
    title: "Play Quiz",
    url: "/app/play",
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

                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
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
    </Sidebar>
  );
}
