import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import "server-only";

export async function getMyCycles() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const cycles = await db.query.cycle.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return cycles;
}

export async function getCycle(id: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  const cycle = await db.query.cycle.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!cycle) throw new Error("Cycle not found");

  if (cycle.userId !== user.userId) throw new Error("Unauthorized");
  return cycle;
}
