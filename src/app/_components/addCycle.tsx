"use client";
import { ChangeEvent, FC, useState, useEffect } from "react";
import { Calendar } from "../../components/ui/calendar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import { Button } from "../../components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getData } from "../actions/cycleActions";
import { usePathname } from "next/navigation";

interface Props {
  createCycle: (value: string, startDate: Date) => void;
}

const AddCycle: FC<Props> = ({ createCycle }) => {
  // State for handling input value
  const [input, setInput] = useState("");

  const [data, setData] = useState<any[]>([]);

  // Event handler for input change
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const [startDate, setStartDate] = useState<Date | undefined>();
  const handleSelectDate = (date: Date | undefined) => {
    setStartDate(date);
  };

  const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };


  const handleAdd = async () => {
    const endDate = addMonths(startDate, 3);
    console.log(endDate);
    createCycle(input, startDate, endDate);
    setInput("");
  };


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Plus size={26} weight="light" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create new Cycle?</AlertDialogTitle>
        </AlertDialogHeader>
        <form>
          <Label>Cycle name:</Label>
          <input
            type="text"
            className="w-full rounded border border-gray-200 px-2 py-1 outline-none"
            onChange={handleInput}
            value={input}
          />
          <Label>Start date:</Label>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleSelectDate}
            className="rounded-md border"
          />

        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAdd}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddCycle;
