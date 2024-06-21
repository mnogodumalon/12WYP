"use client";

import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";
import SimpleUploadButton from "./upload-button";
import Cycles from "./cycles";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

export function TopNav(props: any) {
  const { setTheme } = useTheme();
  const router = useRouter();
  return (
    <nav className="flex w-full flex-col items-center justify-between bg-slate-600 p-4 text-xl font-semibold md:flex-row">
      <div className="flex w-screen flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center justify-center gap-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Link href="/">12wyp</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SignedIn>
          <div className="w-screen overflow-x-auto md:w-auto">
            <Cycles cycles={props.data} />
          </div>
        </SignedIn>
      </div>
      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
}
