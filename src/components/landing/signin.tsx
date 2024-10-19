"use client";

import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";

export function SignIn({
  session,
  className,
}: {
  session: Session | null;
  className?: string;
}) {
  return (
    <>
      {session ? (
        <Link href="/app" className={className}>
          <Button variant="outline" className={className}>
            Open Dashboard
          </Button>
        </Link>
      ) : (
        <Button
          onClick={() => signIn(undefined, { callbackUrl: "/app" })}
          size="sm"
          className={className}
        >
          <LogIn className="size-4" />
          <span>Sign In</span>
        </Button>
      )}
    </>
  );
}
