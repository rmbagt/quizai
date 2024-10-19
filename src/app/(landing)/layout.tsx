import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";
import { Toaster } from "~/components/ui/toaster";
import { SiteHeader } from "~/components/landing/main-navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "min-h-svh scroll-smooth bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      <SiteHeader />
      {children}
      <Toaster />
    </div>
  );
}
