"use client";

import { ColumnDef } from "@tanstack/react-table";
import { taskType } from "../types/taskType";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import AddTask from "../_components/addTask";
import {
  addTask,
  deleteTask,
  editTask,
  toggleTask,
  editStatus,
  editParent,
  editDeadline,
} from "../actions/todoActions";
import React from "react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import { getData } from "../actions/goalActions";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { getData as getDataCycle } from "../actions/cycleActions";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

export const columns: ColumnDef<taskType>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const router = useRouter();
      const [taskStatus, setTaskStatus] = useState(row.original.status);

      const handleStatusChange = async (id: number, newStatus: string) => {
        try {
          await editStatus(id, newStatus);
          setTaskStatus(newStatus);
          console.log(newStatus);
          router.refresh();
        } catch (error) {
          console.error("Failed to update status", error);
        }
      };
      return (
        <Select
          value={taskStatus}
          onValueChange={(value) => handleStatusChange(row.original.id, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={row.original.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Todo">Todo</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "goalId",
    header: "Goal",
    cell: ({ row }) => {
      const [goalData, setGoalData] = useState<any[]>([]);
      const pathname = usePathname();
      const pathParts = pathname.split("/");
      const cycleId = pathParts[pathParts.length - 1];

      useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getData(Number(cycleId)); 
            setGoalData(data); 
          } catch (error) {
            console.error("Fehler beim Abrufen der Daten: ", error);
          }
        };

        fetchData(); 
      }, [cycleId]);

      const [taskParent, setTaskParent] = useState(row.original.goalId);
      const currentGoal = goalData.find(
        (goal) => goal.id === row.original.goalId,
      );
      const goalName = currentGoal ? currentGoal.name : "Select a goal";

      const handleParentChange = (id: number, newParent: number, event) => {
        event.stopPropagation();
        setTaskParent(newParent);
        editParent(id, newParent);
      };

      return (
        <Select
          onValueChange={(value) =>
            handleParentChange(row.original.id, value, event)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={goalName} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Goals</SelectLabel>
              {goalData.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Title",
    cell: ({ row }) => {
      const [title, setTitle] = useState(row.original.name); 

      const handleTitleChange = (event) => {
        setTitle(event.target.value); 
      };

      const handleBlur = () => {
        editTask(row.original.id, title); 
      };

      return (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur} 
          className="w-full rounded border p-1" 
        />
      );
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      const [deadline, setDeadline] = useState<Date | undefined>(
        row.original.deadline ? new Date(row.original.deadline) : undefined,
      );

      const [cycleData, setCycleData] = useState<any[]>([]);

      const pathname = usePathname();
      const pathParts = pathname.split("/");
      const cycleId = pathParts[pathParts.length - 1];

      useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDataCycle();
            setCycleData(data);
          } catch (error) {
            console.error("Fehler beim Abrufen der Daten: ", error);
          } finally {
          }
        };

        fetchData();
      }, []);

      const selectedCycle = useMemo(
        () => cycleData.find((cycle) => cycle.id == cycleId),
        [cycleData, cycleId],
      );

      const handleSelectDate = (date: Date | undefined) => {
        setDeadline(date);
        if (date) {
          editDeadline(row.original.id, date);
        }
      };

      return (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                {deadline
                  ? deadline.toLocaleDateString("de-DE")
                  : "Set Deadline"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={handleSelectDate}
                  className="rounded-md border"
                  fromDate={selectedCycle ? selectedCycle.startDate : undefined}
                  toDate={selectedCycle ? selectedCycle.endDate : undefined}
                />
              }
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(task.id)}
            >
              Copy task ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteTask(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;
