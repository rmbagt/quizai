"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { HiSparkles } from "react-icons/hi2";

import { cn } from "~/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <HiSparkles />
        <span className="font-bold">quiz/ai</span>
      </Link>
      <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
        <Link
          href="/others"
          className={cn(
            "text-nowrap transition-colors hover:text-foreground/80",
            pathname?.startsWith("/others")
              ? "text-foreground"
              : "text-foreground/60",
          )}
        >
          Our Team
        </Link>
      </nav>
    </div>
  );
}
