"use client";

import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";

export function SignIn({ session }: { session: Session | null }) {
  return (
    <>
      {session ? (
        <Link href="/app">
          <Button variant="outline">Open Dashboard</Button>
        </Link>
      ) : (
        <Button
          onClick={() => signIn(undefined, { callbackUrl: "/app" })}
          size="sm"
        >
          <LogIn className="size-4" />
          <span>Sign In</span>
        </Button>
      )}
    </>
  );
}
