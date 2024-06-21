"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { DEFAULT_API_ROUTES } from "node_modules/@clerk/nextjs/dist/types/server/authMiddleware";

import { db } from "~/server/db";
import { task, goal } from "~/server/db/schema";

export const getDataTask = async (goalId: number) => {
  const data = await db.select().from(task).where(eq(task.goalId, goalId));
  return data;
};

export const getDataTaskForCycle = async (goalIds: number[]) => {
  // Wenn die Liste leer ist, gibt direkt eine leere Liste zurück
  if (goalIds.length === 0) {
    return [];
  }

  // Hole alle Tasks aus der Datenbank
  const allTasks = await db.select().from(task);

  // Filtere die Tasks, deren goalId in der Liste goalIds enthalten ist
  const filteredTasks = allTasks.filter((t) => goalIds.includes(t.goalId));

  return filteredTasks;
};

export const getDataTaskAll = async () => {
  const data = await db.select().from(task);
  return data;
};

export const addTask = async (
  name: string,
  deadline: Date | undefined,
  goalId: number,
) => {
  const [insertedTask] = await db
    .insert(task)
    .values({
      name: name,
      deadline: deadline,
      goalId: goalId,
      status: "Todo",
    })
    .returning();
  revalidatePath("/");
  return insertedTask;
};

export const deleteTask = async (id: number) => {
  await db.delete(task).where(eq(task.id, id));

  revalidatePath("/");
};

export const toggleTask = async (id: number) => {
  await db
    .update(task)
    .set({
      status: "Todo",
    })
    .where(eq(task.id, id));

  revalidatePath("/");
};

export const editTask = async (id: number, text: string) => {
  await db
    .update(task)
    .set({
      name: text,
    })
    .where(eq(task.id, id));

  revalidatePath("/");
};

type StatusType = "Todo" | "Done" | "In Progress" | "Canceled";

export const editStatus = async (id: number, status: StatusType) => {
  await db
    .update(task)
    .set({
      status: status,
    })
    .where(eq(task.id, id));

  revalidatePath("/");
};

export const editParent = async (id: number, parent: number) => {
  await db
    .update(task)
    .set({
      goalId: parent,
    })
    .where(eq(task.id, id));

  revalidatePath("/");
};

export const editDeadline = async (id: number, deadline: Date | undefined) => {
  await db
    .update(task)
    .set({
      deadline: deadline,
    })
    .where(eq(task.id, id));

  revalidatePath("/");
};
