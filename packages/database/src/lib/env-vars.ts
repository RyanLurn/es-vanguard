import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const dbEnvVars = createEnv({
  server: {
    LOCAL_DB_FILE: z.string().min(1),
  },
  runtimeEnv: process.env,
});
