import { taskTable } from "@/schema/task";

export type InsertTaskInputValues = typeof taskTable.$inferInsert;
