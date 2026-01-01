import { parsePnpmLockfile } from "@/pnpm";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import semver from "semver";

const getContentResult = await getGithubContent({
  githubBlobUrl: "https://github.com/pnpm/pnpm/blob/main/pnpm-lock.yaml",
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
const dependencySet = new Set<string>();

for (const dependency of dependencyList) {
  if (semver.valid(dependency.version) === null) {
    console.log("Found dependency with invalid version:", dependency);
  }
  if (dependencySet.has(dependency.path)) {
    console.log("Found duplicate dependency:", dependency);
  } else {
    dependencySet.add(dependency.path);
  }
}
