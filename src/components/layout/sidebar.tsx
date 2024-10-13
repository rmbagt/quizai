"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoGrid } from "react-icons/io5";
import { RiSideBarFill } from "react-icons/ri";

type Menu = {
  id: string;
  title: string;
  icon: ReactElement;
  link: string;
};

const style = {
  active: "text-gray-100 font-bold bg-zinc-700",
  inactive:
    "text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:cursor-pointer",
};

const menu = [
  {
    id: "",
    title: "Home",
    icon: <IoGrid />,
    link: "/",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div
        className={`absolute z-30 rounded-lg bg-zinc-600 p-2 text-white shadow-lg transition-all duration-300 hover:cursor-pointer hover:bg-zinc-500 md:text-xl ${
          isMenuOpen ? "mx-4 mt-4" : "mx-4 mt-2"
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <RiSideBarFill />
      </div>
      {isMenuOpen && (
        <div className="absolute z-20 h-full w-full overflow-auto border-r bg-white px-2 pt-16 shadow-2xl dark:bg-gray-800 md:w-[256px]">
          <div className="flex flex-col gap-3">
            {menu.map((item: Menu, index: number) => (
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs md:text-sm ${
                  item.id === currentPath ? style.active : style.inactive
                } transition-all`}
                key={index}
                onClick={() => router.push(item.link)}
              >
                {item.icon}
                <p className="w-full">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
