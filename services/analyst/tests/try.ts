import { getBaseVersion } from "#utils/get-base-version";
import type { Semver } from "@es-vanguard/utils/semver";

const versions = [
  "1.0.0",
  "1.0.1",
  "1.0.0-alpha",
  "1.0.0-beta",
  "1.0.0-rc",
] as Semver[];
const target = "1.0.0-rc" as Semver;

const base = getBaseVersion({ target, base: "previous", versions });
console.log(base);
