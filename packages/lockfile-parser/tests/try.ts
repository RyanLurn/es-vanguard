import type { Dependency } from "@/lib/types";
import { parsePnpmLockfile } from "@/pnpm";
import { PnpmLockfileV9Schema } from "@/pnpm/schema";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import semver from "semver";

const getContentResult = await getGithubContent({
  githubBlobUrl:
    "https://github.com/nuxt/learn.nuxt.com/blob/main/pnpm-lock.yaml",
});

if (getContentResult.isErr()) {
  throw new Error(getContentResult.error.message);
}

const lockfileContent = getContentResult.value;

const parseLockfileResult = await parsePnpmLockfile(lockfileContent);

if (parseLockfileResult.isErr()) {
  throw parseLockfileResult.error;
}

// console.log("Parsed successfully!");
// await Bun.write("try.txt", JSON.stringify(parseLockfileResult.value, null, 2));
// console.log("Written to try.txt");

const dependencyList = parseLockfileResult.value;

const lockfileYamlParseResult = await safeYamlParse({
  text: lockfileContent,
  schema: PnpmLockfileV9Schema,
});

if (lockfileYamlParseResult.isErr()) {
  throw new Error("Failed to parse lockfile");
}

const numberOfSnapshots = Object.keys(
  lockfileYamlParseResult.value.snapshots
).length;
const numberOfDependencies = dependencyList.length;

console.log(`Number of snapshots: ${numberOfSnapshots}`);
console.log(`Number of dependencies: ${numberOfDependencies}`);

const dependencySet = new Set<Dependency>();

for (const dependency of dependencyList) {
  if (semver.valid(dependency.version) === null) {
    console.log("Found dependency with invalid version:", dependency);
  }
  if (
    dependencySet.has({ name: dependency.name, version: dependency.version })
  ) {
    console.log("Found duplicate dependency:", dependency);
  } else {
    dependencySet.add({ name: dependency.name, version: dependency.version });
  }
}
