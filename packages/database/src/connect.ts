import { drizzle } from "drizzle-orm/libsql";
import { DB_URL } from "@/lib/constants";
import * as taskSchema from "@/schema/task";

export const db = drizzle(DB_URL, { schema: { ...taskSchema } });
