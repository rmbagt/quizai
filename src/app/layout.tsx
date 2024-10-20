import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/layout/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import Providers from "~/components/layout/loading-provider";

export const metadata: Metadata = {
  title: "quiz/ai",
  description: "Feel the Power of AI-Generated Learning ✨",
  openGraph: {
    url: "https://quizai.jer.ee",
    siteName: "quiz/ai",
    images: [
      {
        url: "https://img.jer.ee/img/quizai-min-aa50a841.png",
        width: 1200,
        height: 630,
      },
      {
        url: "https://img.jer.ee/img/quizai-min-aa50a841.png",
        width: 1200,
        height: 630,
        alt: "og",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons:
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>",
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
