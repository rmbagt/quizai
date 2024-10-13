"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { IoCloseSharp, IoMenu } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { ModeToggle } from "./mode-toggle";
import type { Session } from "next-auth";

export default function Navbar({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <div className="z-50 flex w-full items-center justify-center transition-all duration-300">
      {isOpen && (
        <>
          {/* Click everywhere to close the Navbar on mobile */}
          {/* <div
              className="md:hidden fixed top-0 w-full h-full"
              onClick={() => setIsOpen(false)}
            /> */}
          <div className="fixed top-0 z-50 flex w-full items-center justify-center bg-opacity-50 md:hidden">
            <div className="flex w-full flex-col gap-6 bg-white p-10 shadow-lg dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <Link href="#" className="font-bold md:text-[24px]">
                  Logo
                </Link>
                <IoCloseSharp
                  className="text-2xl"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/fern.jpg"
                    alt="profile"
                    className="h-[24px] w-[24px] overflow-hidden rounded-full"
                    width={24}
                    height={24}
                  />
                  <p className="text-[16px] font-semibold">
                    {session?.user?.name}
                  </p>
                </div>
                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                  <div className="flex items-center gap-2 text-[16px] font-semibold text-red-600 hover:cursor-pointer">
                    <MdLogout />
                    <p>{session ? "Sign out" : "Sign in"}</p>
                  </div>
                </Link>
              </div>
              <div className="flex w-full items-center justify-center gap-4">
                <Input
                  placeholder="Search..."
                  value={search}
                  className="w-3/4 rounded-xl border px-2 outline-none"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                />
                <div className="md:hidden">
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex w-full items-center justify-between gap-6 border-b bg-white px-4 py-2 dark:bg-gray-800">
        <Link href="#" className="font-bold md:text-[24px]">
          Logo
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <div className="hidden md:block">
            <Input
              placeholder="Search..."
              value={search}
              className="rounded-xl border px-2 outline-none"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>
          <div className="relative hidden items-center justify-center gap-1 md:flex md:gap-2">
            <Image
              src="/fern.jpg"
              alt="profile"
              className="h-[24px] w-[24px] overflow-hidden rounded-full"
              width={24}
              height={24}
            />
            <p className="text-[16px] font-semibold">{session?.user?.name}</p>
            <div
              className="hover:cursor-pointer"
              onClick={() => setIsShow(!isShow)}
            >
              {isShow ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {isShow && (
              <div className="absolute right-0 top-[45px] w-[200px] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                  <div className="flex items-center gap-2 px-4 py-2 text-[16px] font-semibold text-red-600 duration-300 hover:cursor-pointer hover:bg-[#F5F6F6] dark:hover:bg-gray-700">
                    <MdLogout />
                    <p>{session ? "Sign out" : "Sign in"}</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="block md:hidden">
          <IoMenu className="text-3xl" onClick={() => setIsOpen(true)} />
        </div>
      </div>
    </div>
  );
}
