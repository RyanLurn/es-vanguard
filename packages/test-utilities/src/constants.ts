import { join } from "node:path";

// Store cache in the package root: packages/test-utilities/.cache
export const CACHE_DIR = join(import.meta.dir, "../.cache");
