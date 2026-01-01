import type { Semver } from "@/lib/semver-schemas";

interface Dependency {
  name: string;
  version: Semver;
}

export type { Dependency };
