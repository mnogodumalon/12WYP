// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { desc, sql } from "drizzle-orm";
import { boolean, integer } from "drizzle-orm/pg-core";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { url } from "inspector";
import { array } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `12wyp_${name}`);

export const cycle = createTable(
  "cycle",
  {
    id: serial("id").primaryKey(), // serial für den Primärschlüssel
    name: varchar("name").notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (cycle) => ({
    nameIndex: index("name_idx").on(cycle.name),
  }),
);

export const goal = createTable("goals", {
  id: serial("id").primaryKey(), // serial für den Primärschlüssel
  name: varchar("name").notNull(),
  description: varchar("description", { length: 1024 }).notNull(),
  isAccomplished: boolean("is_accomplished").default(false).notNull(),
  cycleId: integer("cycle_id") // integer für den Fremdschlüssel
    .references(() => cycle.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const task = createTable("tasks", {
  id: serial("id").primaryKey(), // serial für den Primärschlüssel
  name: varchar("name").notNull(),
  isAccomplished: boolean("is_accomplished").default(false).notNull(),
  week: integer("week").notNull(),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
  goalId: integer("goal_id") // integer für den Fremdschlüssel
    .references(() => goal.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const motivationLists = createTable("motivations_list", {
  id: serial("id").primaryKey(), // serial für den Primärschlüssel
  name: varchar("name").default("Motivation List").notNull(),
  cycleId: integer("cycle_id") // integer für den Fremdschlüssel
    .references(() => cycle.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const motivation = createTable("motivation", {
  id: serial("id").primaryKey(), // serial für den Primärschlüssel
  name: varchar("name").notNull(),
  description: varchar("description", { length: 1024 }).notNull(),
  motivationListId: integer("motivations_list_id") // integer für den Fremdschlüssel
    .references(() => motivationLists.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});
