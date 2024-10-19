import Link from "next/link";
import { SiGithub } from "react-icons/si";

import { MainNav } from "./main-nav";
import { Button } from "../ui/button";
import { ModeToggle } from "../layout/mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex w-full justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 w-full items-center justify-between">
        <MainNav />
        {/* <MobileNav /> */}
        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
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
          </nav>
        </div>
      </div>
    </header>
  );
}
