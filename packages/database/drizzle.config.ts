import { DB_URL } from "@/lib/constants";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: DB_URL,
  },
  out: "./migrations",
  schema: "./src/schema",
  dialect: "sqlite",
});
