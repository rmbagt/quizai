"use client";

import MemberCard from "~/components/landing/member-card";

const members = [
  {
    avatarSrc: "/Jerry.jpg",
    avatarFallback: "J",
    name: "Stanislaus Kanaya Jerry Febriano",
    description: "BINUS University - stanislaus.febriano@binus.ac.id",
    quote: "Whatever the result is, be proud!",
  },
  {
    avatarSrc: "/Reynard.jpg",
    avatarFallback: "R",
    name: "Reynard Hansel",
    description: "BINUS University - reynard.hansel@binus.ac.id",
    quote: "We need to do our best, and God will handle the rest.",
  },
  {
    avatarSrc: "/Aldo.jpg",
    avatarFallback: "R",
    name: "Reynaldo Marchell Bagas Adji",
    description: "BINUS University - reynaldo.adji@binus.ac.id",
    quote: "Strive for greatness!",
  },
];

export default function Acknowledges() {
  return (
    <>
      <div className="absolute -z-10 -mt-[56px] h-screen w-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-400/30 via-red-50/0 transition-colors dark:from-cyan-600/50 dark:via-red-50/0" />
      <div className="layout">
        <section id="intro">
          <div className="-mt-[56px] flex h-screen w-full flex-col items-center justify-center gap-4 align-middle">
            <h1 className="balance h-36 w-[102%] bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-center text-8xl font-extrabold tracking-tighter text-transparent dark:bg-gradient-to-r dark:from-green-300 dark:to-purple-400">
              Our Members
            </h1>
            <div className="grid grid-cols-2 gap-4">
              {members.map((member, index) => (
                <MemberCard key={index} {...member} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
