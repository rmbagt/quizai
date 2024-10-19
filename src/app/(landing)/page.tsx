"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Accent from "~/components/landing/accent";

import { Button } from "~/components/ui/button";

export default function Home() {
  const [egg, setEgg] = useState(false);

  return (
    <>
      <div className="absolute z-10 -mt-16 h-screen w-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-400/30 via-red-50/0 transition-colors dark:from-cyan-600/30 dark:via-red-50/0" />
      <div className="layout px-4 sm:px-6 lg:px-8">
        <section id="intro">
          <div className="-mt-[56px] flex min-h-screen w-full flex-col items-center justify-center gap-4 align-middle">
            <p className="bg-gradient-to-r from-purple-400 to-yellow-400 text-center text-xl font-bold tracking-tight dark:bg-gradient-to-r dark:from-green-300 dark:via-blue-500 dark:to-purple-600 sm:text-2xl">
              quiz/ai
            </p>

            <h1 className="balance w-full bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-center text-4xl font-extrabold tracking-tighter text-transparent dark:bg-gradient-to-r dark:from-green-300 dark:to-purple-400 sm:text-6xl lg:text-8xl">
              Feel the Power of
              <span className="inline-block">AI-Generated</span> Learning{" "}
              <HiSparkles className="absolute inline-block text-2xl text-yellow-400 sm:text-4xl" />
            </h1>

            <p className="balance w-full text-center text-base text-muted-foreground sm:w-2/3 sm:text-xl">
              With the ability to{" "}
              <span className="inline-block bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text font-bold italic text-transparent dark:bg-gradient-to-r dark:from-green-300 dark:to-purple-400">
                generate tailored quiz questions
              </span>{" "}
              based on user input, this app opens up vast possibilities for
              personalized learning experiences.
            </p>

            <div className="z-20 flex h-20 items-center justify-center align-middle">
              <div className="flex gap-2">
                <Link href="/app">
                  <Button
                    variant="default"
                    className="rounded-full font-extrabold"
                  >
                    Try it out! 🚀
                  </Button>
                </Link>
              </div>
            </div>

            <p className="z-20 text-sm text-muted-foreground sm:text-base">
              Lihat bagaimana proses kami
              <Link href="#about">
                <FaArrowDown className="ml-1 inline-block animate-bounce" />
              </Link>
            </p>
          </div>
        </section>

        <section id="about" className="w-full py-16 sm:py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
              🌐 <Accent>Powered by AI</Accent>
            </h1>
            <p className="balance max-w-[48rem] text-center text-base text-muted-foreground sm:text-xl">
              By combining machine learning and NLP techniques, our app offers a
              deeply{" "}
              <Accent className="font-bold">
                personalized quiz experience
              </Accent>
              . Users can test their knowledge, review their results, and
              continue refining their learning paths as the app adapts to their
              progress. (Bidirectional Encoder Representations from
              Transformers).{" "}
            </p>
          </div>
        </section>

        <section id="parameter" className="w-full py-16 sm:py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
              💡 Why use <Accent className="font-black">quiz/ai</Accent>?
            </h1>
            <p className="balance max-w-[48rem] text-center text-base text-muted-foreground sm:text-xl">
              Whether you&apos;re studying for an exam, brushing up on skills,
              or simply curious about a new subject, our app provides an{" "}
              <Accent className="font-bold">
                instant, easy, and customizable learning tool
              </Accent>{" "}
              . Just input your topic, and let the AI do the rest!
            </p>
          </div>
        </section>

        <section id="start" className="w-full py-16 sm:py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
              🚀 <Accent>Mari kita coba!</Accent>
            </h1>
            <p className="balance max-w-[48rem] text-center text-base text-muted-foreground sm:text-xl">
              Lansung saja, mari coba aplikasi kami!
            </p>
            <Link href="/app">
              <Button variant="default" className="rounded-full font-extrabold">
                Try it out! 🚀
              </Button>
            </Link>
          </div>
        </section>

        <footer className="flex h-fit flex-col items-center justify-center py-5 align-middle">
          <div className="flex gap-2 text-sm text-muted-foreground sm:text-base">
            Made with 💖 by{" "}
            <span
              onClick={() => setEgg(!egg)}
              className="-ml-1 cursor-pointer rounded-md px-1 py-[0.5] text-primary hover:bg-primary/20"
            >
              quiz/ai.
            </span>
          </div>
          {egg && (
            <div className="my-5">
              <Link href="https://youtu.be/JTOM6fuXptg" target="_blank">
                <Image
                  src={`/fern.jpg`}
                  alt="binus/ai"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          )}
        </footer>
      </div>
    </>
  );
}
