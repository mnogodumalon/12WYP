"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import { goal, cycle } from "~/server/db/schema";

export const getData = async (cycleId: number) => {
  const data = await db.select().from(goal).where(eq(goal.cycleId, cycleId));
  return data;
};

export const addGoal = async (
  name: string,
  description: string,
  cycleId: number,
) => {
  const [insertedGoal] = await db
    .insert(goal)
    .values({
      name: name,
      description: description,
      cycleId: cycleId,
    })
    .returning();
  revalidatePath("/");
  return insertedGoal;
};

export const deleteGoal = async (id: number) => {
  await db.delete(goal).where(eq(goal.id, id));

  revalidatePath("/");
};

export const toggleGoal = async (id: number) => {
  await db
    .update(goal)
    .set({
      isAccomplished: !goal.isAccomplished,
    })
    .where(eq(goal.id, id));

  revalidatePath("/");
};

export const editGoal = async (
  id: number,
  name: string,
  description: string,
) => {
  await db
    .update(goal)
    .set({
      name: name,
      description: description,
    })
    .where(eq(goal.id, id));

  revalidatePath("/");
};
