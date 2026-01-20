import { join } from "node:path";

const CACHE_DIR = join(import.meta.dir, ".cache");
console.log(CACHE_DIR);
