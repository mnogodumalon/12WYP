"use client";
import { ChangeEvent, FC, useState } from "react";
import { goalType } from "../types/goalType";
import Tasks from "./tasks";
import { getDataTask } from "../actions/todoActions";
import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import React from "react";
import { Button } from "../../components/ui/button";
import { DotsThree } from "@phosphor-icons/react/dist/ssr";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
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
import { Label } from "../../components/ui/label";

const labels = [
  "feature",
  "bug",
  "enhancement",
  "documentation",
  "design",
  "question",
  "maintenance",
];

interface Props {
  goal: goalType;
  changeGoalName: (id: number, name: string, description: string) => void;
  toggleIsGoalDone: (id: number, isAccomplished: boolean) => void;
  deleteGoalItem: (id: number) => void;
}

const Goal: FC<Props> = ({
  goal,
  changeGoalName,
  toggleIsGoalDone,
  deleteGoalItem,
}) => {
  const [label, setLabel] = React.useState("feature");
  const [open, setOpen] = React.useState(false);

  const [progress, setProgress] = React.useState(20);

  const [taskData, setTaskData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataTask(goal.id); 
        setTaskData(data); 
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten: ", error);
      }
    };

    fetchData(); 
  }, [goal.id]); 



  useEffect(() => {
    const totalTasks = taskData.length;
    const completedTasks = taskData.filter(
      (task) => task.status === "Done" || task.status === "Canceled",
    ).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(progress);
  }, [taskData]);


  const [editing, setEditing] = useState(false);


  const [name, setName] = useState(goal.name);

  const [description, setDescription] = useState(goal.description);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [isAccomplished, setIsAccomplished] = useState(goal.isAccomplished);


  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
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


  const handleSave = () => {
    if (goal.id !== undefined) {
      changeGoalName(goal.id, name, goal.description); 
      setEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
      event.preventDefault(); 
    }
  };


  const handleCancel = () => {
    setEditing(false);
    setName(goal.name);
  };


  const handleDelete = () => {
    if (goal.id !== undefined) {
      if (confirm("Are you sure you want to delete this todo?")) {
        deleteGoalItem(goal.id);
      }
    }
  };


  return (
    <div className="flex flex-col">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex">
            <div className="flex flex-col">
              <Label>Goal:</Label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                onKeyDown={handleKeyDown}
                readOnly={!editing}
                onBlur={handleBlur}
                className={`${
                  goal.isAccomplished ? "line-through" : ""
                } w-full rounded border-gray-200 px-2 py-1 outline-none read-only:border-transparent focus:border`}
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
          <Label>Progress:</Label>
          <Progress value={progress} className="w-[60%]" />
        </CardHeader>
      </Card>
    </div>
  );
};

export default Goal;
