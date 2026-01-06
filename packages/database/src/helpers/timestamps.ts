import { integer } from "drizzle-orm/sqlite-core";
import { jsDateInSqlite } from "@/helpers/js-date";

export const timestamps = {
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(jsDateInSqlite)
    .$onUpdate(() => new Date()),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(jsDateInSqlite),
};
