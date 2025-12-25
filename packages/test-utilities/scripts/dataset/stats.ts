import {
  pnpmLockfileUrls,
  pnpmV5LockfileUrls,
  pnpmV6LockfileUrls,
  pnpmV9LockfileUrls,
} from "#constants.ts";

console.log("Number of pnpm v5 lockfiles: ", pnpmV5LockfileUrls.length);
console.log("Number of pnpm v6 lockfiles: ", pnpmV6LockfileUrls.length);
console.log("Number of pnpm v9 lockfiles: ", pnpmV9LockfileUrls.length);
console.log("Number of all pnpm lockfiles: ", pnpmLockfileUrls.length);
