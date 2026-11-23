import { sqliteTable, integer, text, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const events = sqliteTable(
  "portal_events",
  { seq: integer("seq").primaryKey(), payload: text("payload").notNull() },
  (table) => [check("valid_event", sql`json_valid(${table.payload})`)],
);
