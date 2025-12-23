import type { Inputs } from "@/lib/types";

const SUPPORTED_PMS = ["npm", "yarn", "pnpm", "deno", "bun"] as const;

const DEFAULT_CWD = ".";
const DEFAULT_BASE = "main";
const DEFAULT_HEAD = "HEAD";
const DEFAULT_PM: Inputs["pm"] = "auto";

export { SUPPORTED_PMS, DEFAULT_CWD, DEFAULT_BASE, DEFAULT_HEAD, DEFAULT_PM };
