import { SignedOut, SignedIn } from "@clerk/nextjs";
import { getMyCycles } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { getData } from "./actions/cycleActions";
import AddCycle from "./_components/addCycle";
import Cycle from "./_components/cycle";
import Cycles from "./_components/cycles";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getData();
  return (
    <main className="mt-96 flex flex-1 flex-col items-center justify-center bg-neutral-950 text-white">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sing in above
        </div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-3xl">Create new Cycle or choose one!</h1>
      </SignedIn>
    </main>
  );
}
