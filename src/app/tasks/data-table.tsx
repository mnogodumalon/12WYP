"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import React, { useState } from "react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import AddTodo from "../_components/addTask";
import { taskType } from "../types/taskType";
import { useRouter } from "next/navigation";
import {
  addTask,
  deleteTask,
  editTask,
  toggleTask,
} from "../actions/todoActions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  cycleId: number;
  tasks: taskType[];
  task: taskType;
  changeTaskText: (id: number, text: string) => void;
  toggleIsTaskDone: (id: number, done: boolean) => void;
  deleteTaskItem: (id: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  cycleId,
  tasks,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const createTask = async (
    name: string,
    deadline: Date | undefined,
    goalId: number,
  ) => {
    try {
      const newTask = await addTask(name, deadline, goalId);
      if (newTask) {
        //   console.log("New task data:", newTask);
        //   setTaskItems((prev) => [...prev, newTask]);
        //   router.refresh();
      } else {
        console.error("Error: New goal data is undefined.");
      }
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-between py-4 md:flex-row md:items-center">
        <Input
          placeholder="Filter todos..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddTodo cycleId={cycleId} createTask={createTask} />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4 md:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
