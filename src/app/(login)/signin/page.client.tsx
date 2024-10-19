"use client";

import { Button } from "@/components/ui/button";
import { signIn, type ClientSafeProvider } from "next-auth/react";
import React from "react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function SignInButton({ provider }: { provider: ClientSafeProvider }) {
  switch (provider.id) {
    case "google":
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            onClick={() => signIn(provider.id)}
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
            onClick={() => signIn(provider.id)}
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
