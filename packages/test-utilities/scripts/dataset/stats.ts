import {
  npmLockfileUrls,
  npmV1LockfileUrls,
  npmV2LockfileUrls,
  npmV3LockfileUrls,
} from "#datasets/npm.ts";
import {
  pnpmLockfileUrls,
  pnpmV5LockfileUrls,
  pnpmV6LockfileUrls,
  pnpmV9LockfileUrls,
} from "#datasets/pnpm.ts";

console.log("npm stats:");
console.log("Number of npm v1 lockfiles: ", npmV1LockfileUrls.length);
console.log("Number of npm v2 lockfiles: ", npmV2LockfileUrls.length);
console.log("Number of npm v3 lockfiles: ", npmV3LockfileUrls.length);
console.log("Number of all npm lockfiles: ", npmLockfileUrls.length);

console.log("\npnpm stats:");
console.log("Number of pnpm v5 lockfiles: ", pnpmV5LockfileUrls.length);
console.log("Number of pnpm v6 lockfiles: ", pnpmV6LockfileUrls.length);
console.log("Number of pnpm v9 lockfiles: ", pnpmV9LockfileUrls.length);
console.log("Number of all pnpm lockfiles: ", pnpmLockfileUrls.length);
