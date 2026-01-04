import { $ } from "bun";

const deps = await $`bun list --json`.json();
console.log(deps);
