"use server";

import { db } from "~/server/db";
import { cycle } from "~/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const addCycle = async (
  name: string,
  startDate: Date,
  endDate: Date,
) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const [insertedCycle] = await db
    .insert(cycle)
    .values({
      userId: user.userId,
      name: name,
      url: "https://utfs.io/f/910612fa-a13b-4141-a52d-29240f123b72-1f.jpeg",
      startDate: startDate,
      endDate: endDate,
    })
    .returning();
  revalidatePath("/");
  return insertedCycle;
};

export const getData = async () => {
  const user = auth();

  const data = await db
    .select()
    .from(cycle)
    .where(eq(cycle.userId, user.userId));
  return data;
};

export const editCycle = async (id: number, name: string) => {
  await db
    .update(cycle)
    .set({
      name: name,
    })
    .where(eq(cycle.id, id));
  revalidatePath("/");
};

export const deleteCycle = async (id: number) => {
  await db.delete(cycle).where(eq(cycle.id, id));

  revalidatePath("/");
};
