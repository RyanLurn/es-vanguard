import { jsYamlParser } from "bench/js-yaml-parser";
import { bunParser } from "bench/bun-parser";
import { pnpmLockfileUrls } from "@es-vanguard/test-utilities/datasets/pnpm.ts";

console.log("Benchmarking js-yaml parser...");
const jsYamlTime = await jsYamlParser(pnpmLockfileUrls);
console.log(`js-yaml parser: ${jsYamlTime / 1e9} s`);

console.log("Benchmarking bun parser...");
const bunTime = await bunParser(pnpmLockfileUrls);
console.log(`bun parser: ${bunTime / 1e9} s`);

const gap = jsYamlTime - bunTime;
console.log(`Gap: ${gap / 1e9} s`);
