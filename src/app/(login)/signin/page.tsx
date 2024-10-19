import Link from "next/link";
import { RandomText } from "@/components/auth/random-text";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { SignIn } from "./page.client";
import { ErrorLoginMessage } from "~/components/auth/error";
import { HiSparkles } from "react-icons/hi2";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/");
  }

  return (
    <section className="flex min-h-screen w-full flex-col bg-[hsl(262.1_83.3%_57.8%)] lg:flex-row">
      {/* Desktop left section */}
      <div className="hidden lg:flex lg:w-2/3 lg:flex-col lg:justify-between lg:p-5">
        <Link href="/" className="mr-6 flex items-center space-x-2 text-white">
          <HiSparkles className="h-6 w-6" />
          <span className="font-bold">quiz/ai</span>
        </Link>
        <RandomText />
        <p className="text-white">
          Made with 🩷 from{" "}
          <span className="-ml-1 cursor-pointer rounded-md px-1 py-[0.5] text-white hover:bg-primary/20">
            quiz/ai.
          </span>
        </p>
      </div>

      {/* Mobile and Desktop right section */}
      <div className="flex flex-1 items-center justify-center bg-secondary p-4 lg:w-1/3 lg:bg-secondary lg:p-5">
        <div className="w-full max-w-md space-y-8">
          <div className="rounded-lg bg-white px-6 py-8 shadow-md lg:shadow-none">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 lg:text-3xl">
              Log in to your account
            </h2>

            <div className="mt-4 space-y-2">
              <SignIn />
            </div>

            <ErrorLoginMessage />
          </div>
        </div>
      </div>

      {/* Mobile bottom section */}
      <div className="mt-2 flex flex-col items-center bg-[hsl(262.1_83.3%_57.8%)] p-4 text-white lg:hidden">
        <Link href="/" className="mb-4 flex items-center space-x-2">
          <HiSparkles className="h-6 w-6" />
          <span className="font-bold">quiz/ai</span>
        </Link>
        <p className="text-background/80">
          Made with 🩷 from{" "}
          <span className="-ml-1 cursor-pointer rounded-md px-1 py-[0.5] hover:bg-primary/20">
            quiz/ai.
          </span>
        </p>
      </div>
    </section>
  );
}
