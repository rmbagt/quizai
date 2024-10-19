"use client";

import { Button } from "@/components/ui/button";
import { signIn, type ClientSafeProvider } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Skeleton } from "~/components/ui/skeleton";

type Providers = Record<string, ClientSafeProvider>;

export function SignIn() {
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data: Providers) => setProviders(data))
      .catch((error) => console.error("Error fetching providers:", error));
  }, []);

  if (!providers) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-10 w-full bg-muted-foreground/10" />
        <Skeleton className="h-10 w-full bg-muted-foreground/10" />
      </div>
    );
  }

  return (
    <>
      {providers &&
        Object.values(providers).map((provider: ClientSafeProvider) => (
          <SignInButton key={provider.id} provider={provider} />
        ))}
    </>
  );
}

export function SignInButton({ provider }: { provider: ClientSafeProvider }) {
  if (!provider) return null;

  switch (provider.id) {
    case "google":
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            onClick={() => signIn(provider.id, { callbackUrl: "/app" })}
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FcGoogle className="mr-2 h-5 w-5 text-red-500" />
            Sign in with Google
          </Button>
        </div>
      );

    case "discord":
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            onClick={() => signIn(provider.id, { callbackUrl: "/app" })}
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#5865F2] px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2"
          >
            <FaDiscord className="mr-2 h-5 w-5" />
            Sign in with Discord
          </Button>
        </div>
      );

    default:
      return null;
  }
}
