import { text, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { timestamps } from "@/helpers/timestamps";

export const taskTable = sqliteTable(
  "tasks",
  {
    name: text("name").$type<NpmPackageName>().notNull(),
    version: text("version").$type<Semver>().notNull(),
    previousVersion: text("previous_version").$type<Semver>().notNull(),
    invoker: text("invoker", {
      enum: ["watcher-service", "analysis-job", "listener-app"],
    })
      .notNull()
      .default("watcher-service"),
    status: text("status", {
      enum: ["created", "completed", "failed"],
    })
      .notNull()
      .default("created"),
    verdict: text("verdict", {
      enum: ["unknown", "safe", "suspicious", "malicious"],
    })
      .notNull()
      .default("unknown"),
    summary: text("summary"),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.name, table.version, table.previousVersion] }),
  ]
);
