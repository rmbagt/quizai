import Link from "next/link";
import { SiGithub } from "react-icons/si";

import { MainNav } from "./logo";
import { Button } from "../ui/button";
import { ModeToggle } from "../layout/mode-toggle";
import { SignIn } from "./signin";
import { getServerAuthSession } from "~/server/auth";
import { HiSparkles } from "react-icons/hi2";
import { MobileNav } from "./nav.client";

interface NavItem {
  title: string;
  href: string;
}

export async function SiteHeader() {
  const session = await getServerAuthSession();
  const navItems: NavItem[] = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/others" },
  ];

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between p-4">
        <div className="flex w-full items-center justify-between">
          <MainNav />
          <MobileNav items={navItems} session={session} />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="https://github.com/reynaldomarchell/srifoton-hack"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="icon">
              <SiGithub />
            </Button>
            <span className="sr-only">GitHub</span>
          </Link>
          <ModeToggle />
          <SignIn session={session} />
        </div>
      </div>
    </header>
  );
}
