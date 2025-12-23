import type { PmOption } from "@/helpers/validate/pm";

const SUPPORTED_PMS = ["npm", "yarn", "pnpm", "deno", "bun"] as const;

const DEFAULT_CWD = ".";
const DEFAULT_BASE = "DEFAULT_BRANCH";
const DEFAULT_HEAD = "CURRENT_BRANCH";
const DEFAULT_PM_OPTION: PmOption = "auto";

export {
  SUPPORTED_PMS,
  DEFAULT_CWD,
  DEFAULT_BASE,
  DEFAULT_HEAD,
  DEFAULT_PM_OPTION,
};
