import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/layout/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import Providers from "~/components/layout/loading-provider";

export const metadata: Metadata = {
  title: "quiz/ai",
  description: "AI Generated Learning Quiz",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            <Providers>{children}</Providers>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
