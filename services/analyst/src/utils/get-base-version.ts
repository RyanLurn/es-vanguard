import type { Semver } from "@es-vanguard/utils/semver";
import { semver } from "bun";

export function getBaseVersion({
  target,
  base,
  versions,
}: {
  target: Semver;
  base: Semver | "previous";
  versions: Semver[];
}) {
  if (base !== "previous") {
    return base;
  }
  const sortedVersions = versions.sort(semver.order);
  const targetIndex = sortedVersions.indexOf(target);
  const baseVersion = sortedVersions[targetIndex - 1];
  return baseVersion;
}
