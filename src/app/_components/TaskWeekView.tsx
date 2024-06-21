"use client";

import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { Button } from "../../components/ui/button";

interface Task {
  id: number;
  name: string;
  deadline: string; 
  status: string;
}

interface TaskWeekViewProps {
  dataTask: Task[];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE"); 
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMonday(date: Date): Date {
  const day = date.getDay();
  const diff = (day <= 0 ? -6 : 1) - day; 
  return addDays(date, diff);
}

const TaskWeekView: React.FC<TaskWeekViewProps> = ({ dataTask }) => {
  const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()));
  const [tasks, setTasks] = useState<Task[]>([]); 

  const changeWeek = (days: number): void => {
    setWeekStart((prevWeekStart) => addDays(prevWeekStart, days));
  };

  useEffect(() => {
    const endOfWeek: Date = addDays(weekStart, 6);
    const filteredTasks: Task[] = dataTask.filter((task) => {
      const taskDate = new Date(task.deadline); 
      return (
        taskDate >= weekStart &&
        taskDate <= endOfWeek &&
        task.status !== "Done" &&
        task.status !== "Canceled"
      );
    });
    setTasks(filteredTasks); 
  }, [weekStart, dataTask]);

  const tasksByDay = (day: number): Task[] => {
    const dayStart = startOfDay(addDays(weekStart, day));
    const dayEnd = addDays(dayStart, 1);

    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline);
      return taskDate >= dayStart && taskDate < dayEnd;
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A list of tasks for the week.</TableCaption>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 7 }).map((_, i) => (
              <TableHead key={i}>{formatDate(addDays(weekStart, i))}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <TableCell key={dayIndex}>
                {tasksByDay(dayIndex).map((task) => (
                  <div key={task.id}>{task.name}</div>
                ))}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex items-center justify-start space-x-2 py-4 md:justify-end">
        <Button variant="outline" size="sm" onClick={() => changeWeek(-7)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => changeWeek(7)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default TaskWeekView;
