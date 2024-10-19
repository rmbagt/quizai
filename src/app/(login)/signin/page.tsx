import Link from "next/link";
import { BotMessageSquare } from "lucide-react";
import { getProviders } from "next-auth/react";

import { RandomText } from "@/components/auth/random-text";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { SignInButton } from "./page.client";
import { Suspense } from "react";
import { ErrorLoginMessage } from "~/components/auth/error";
import { HiSparkles } from "react-icons/hi2";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/");
  }

  const providers = await getProviders();

  return (
    <>
      <section className="flex h-screen w-screen justify-between bg-[hsl(262.1_83.3%_57.8%)]">
        <div className="flex flex-col justify-between p-5">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 text-white"
          >
            <HiSparkles />
            <span className="hidden font-bold sm:inline-block">quiz/ai</span>
          </Link>
          <RandomText />
          <p className="text-white">
            Made with 🩷 from{" "}
            <span className="-ml-1 cursor-pointer rounded-md px-1 py-[0.5] text-white hover:bg-primary/20">
              quiz/ai.
            </span>
          </p>
        </div>
        <div className="relative flex h-full w-[500px] flex-col items-center justify-center bg-accent">
          <div className="relative flex h-full max-w-sm flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-5">
              <p className="mb-4 text-4xl font-bold text-foreground">
                Welcome back!
              </p>
              <Suspense>
                <ErrorLoginMessage />
              </Suspense>
              <div className="flex w-full flex-col">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <SignInButton key={provider.name} provider={provider} />
                  ))}
              </div>

              <div className="flex gap-2">
                <p className="text-sm">Don&apos;t have an account?</p>
                <Link href="#" className="text-sm text-[#D36A7B]">
                  Register
                </Link>
              </div>
            </div>
            <div className="relative top-[25%] flex flex-col items-center">
              <div className="flex">
                <p className="text-lg">Anything Music Quiz</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
