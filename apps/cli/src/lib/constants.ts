import type { Inputs } from "@/lib/types";

const DEFAULT_BASE = "main";
const DEFAULT_HEAD = "HEAD";
const DEFAULT_RUNTIME: Inputs["runtime"] = "auto";
const DEFAULT_PACKAGE_MANAGER: Inputs["package-manager"] = "auto";

export { DEFAULT_BASE, DEFAULT_HEAD, DEFAULT_RUNTIME, DEFAULT_PACKAGE_MANAGER };
