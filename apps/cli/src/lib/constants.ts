import type { Inputs } from "@/lib/types";

const SUPPORTED_PACKAGE_MANAGERS = [
  "npm",
  "yarn",
  "pnpm",
  "deno",
  "bun",
] as const;

const DEFAULT_BASE = "main";
const DEFAULT_HEAD = "HEAD";
const DEFAULT_PACKAGE_MANAGER: Inputs["package-manager"] = "auto";

export {
  SUPPORTED_PACKAGE_MANAGERS,
  DEFAULT_BASE,
  DEFAULT_HEAD,
  DEFAULT_PACKAGE_MANAGER,
};
