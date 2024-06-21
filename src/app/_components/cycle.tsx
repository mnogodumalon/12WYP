"use client";
import React, { ChangeEvent, FC, useState, useRef } from "react";
import { cycleType } from "../types/cycleType";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { Button } from "../../components/ui/button";
import { DotsThree } from "@phosphor-icons/react/dist/ssr";
import { Label } from "../../components/ui/label";

interface Props {
  cycle: cycleType;
  changeCycleText: (id: number, text: string) => void;
  deleteCycleItem: (id: number) => void;
}

const Cycle: FC<Props> = ({ cycle, changeCycleText, deleteCycleItem }) => {
  const [editing, setEditing] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  const [text, setText] = useState(cycle.name);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => {
      const input = nameInputRef.current;
      if (input) {
        const value = input.value;
        input.value = "";
        input.value = value;
        input.focus();
      }
    }, 100);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
      event.preventDefault();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleSave = async () => {
    if (cycle.id !== undefined) {
      changeCycleText(cycle.id, text);
      setEditing(false);
    } else {
      console.error("Error: Cycle ID is undefined.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setText(cycle.name);
  };

  const handleDelete = () => {
    if (
      cycle.id !== undefined &&
      confirm("Are you sure you want to delete this todo?")
    ) {
      deleteCycleItem(cycle.id);
    } else if (cycle.id === undefined) {
      console.error("Error: Cycle ID is undefined.");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex">
          <div className="flex flex-col">
            <Label>Cycle:</Label>
            <input
              ref={nameInputRef}
              type="text"
              value={text}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setText(e.target.value)
              }
              onKeyDown={handleKeyDown}
              readOnly={!editing}
              onBlur={handleBlur}
              className={` w-full rounded border-gray-200 px-2 py-1 outline-none read-only:border-transparent focus:border`}
            />
          </div>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button disabled={editing} variant="ghost" size="sm">
                <DotsThree size={20} weight="light" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>

        <Label>{`Timeline: ${cycle.startDate.toLocaleDateString("de-DE")} - ${cycle.endDate.toLocaleDateString("de-DE")}`}</Label>
      </CardHeader>
    </Card>
  );
};

export default Cycle;
