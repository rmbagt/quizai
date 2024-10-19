import Link from "next/link";
import { SiGithub } from "react-icons/si";

import { MainNav } from "./main-nav";
import { Button } from "../ui/button";
import { ModeToggle } from "../layout/mode-toggle";
import { SignIn } from "./signin";
import { getServerAuthSession } from "~/server/auth";

export async function SiteHeader() {
  const session = await getServerAuthSession();
  return (
    <header className="sticky top-0 z-50 flex w-full justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between p-4">
        <MainNav />
        {/* <MobileNav /> */}
        <div className="flex w-full items-center justify-between gap-2 md:justify-end">
          <div className="flex items-center gap-2">
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
          </div>

          <SignIn session={session} />
        </div>
      </div>
    </header>
  );
}
