"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import type { Session } from "next-auth";
import { SiGithub } from "react-icons/si";
import { ModeToggle } from "../layout/mode-toggle";
import { SignIn } from "./signin";

interface NavItem {
  title: string;
  href: string;
}

export function MobileNav({
  items,
  session,
}: {
  items: NavItem[];
  session: Session | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <Menu />
      </Button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 mt-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="https://github.com/reynaldomarchell/srifoton-hack"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 hover:bg-accent"
          >
            GitHub
            <SiGithub />
            <span className="sr-only">GitHub</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 hover:bg-accent">
            Mode Toggle <ModeToggle />
          </div>

          <div className="flex items-center gap-2 px-4 py-2">
            <SignIn className="w-full" session={session} />
          </div>
        </div>
      )}
    </div>
  );
}
