import { ok, err, type Result } from "neverthrow";
import semver from "semver";
import { safeJsonParse } from "@es-vanguard/json-parser";
import { NpmLockfileSchema } from "@/npm/schema";

interface Dependency {
  name: string;
  version: string;
  path: string;
}

/**
 * Extracts the package name from a path segment.
 *
 * Logic:
 * 1. Split by "node_modules/"
 * 2. Take the last segment
 *
 * Example:
 * "node_modules/react" -> ["", "react"] -> "react"
 * "node_modules/@scope/pkg" -> ["", "@scope/pkg"] -> "@scope/pkg"
 * "packages/a/node_modules/foo" -> ["packages/a/", "foo"] -> "foo"
 */
function getNameFromPath(path: string): string {
  const segments = path.split("node_modules/");
  const name = segments[segments.length - 1];

  if (!name) {
    // This case is theoretically unreachable because we filter out
    // paths without "node_modules/" before calling this function.
    // This is included to make TypeScript happy.
    throw new Error(`Could not extract package name from path: ${path}`);
  }

  return name;
}

async function parseNpmLockfile(
  content: string
): Promise<Result<Dependency[], Error>> {
  // 1. Parse JSON with our Zod Schema
  const jsonResult = await safeJsonParse({
    text: content,
    schema: NpmLockfileSchema,
  });

  if (jsonResult.isErr()) {
    return err(jsonResult.error);
  }

  const lockfile = jsonResult.value;
  const dependencies: Dependency[] = [];

  // 2. Iterate over the 'packages' object (Lockfile v2/v3 structure)
  for (const [path, pkg] of Object.entries(lockfile.packages)) {
    // REQUIREMENT: Exclude internal workspaces/packages.
    // In v2/v3 lockfiles, dependencies (even nested ones) always contain "node_modules/" in the path.
    // Workspace declarations (e.g. "packages/my-lib") do not.
    if (!path.includes("node_modules/")) {
      continue;
    }

    // REQUIREMENT: Exclude deps not from npm registry.
    // We use semver validity as a proxy for "is this a registry version?".
    // Git deps usually have version: "git+ssh://..." or are invalid semver strings.
    // File deps have version: "file:..."
    if (!pkg.version || !semver.valid(pkg.version)) {
      continue;
    }

    // Determine the real package name
    // Priority: 'name' field in metadata (handles aliases) -> derived from folder path
    const name = pkg.name ?? getNameFromPath(path);

    dependencies.push({
      name,
      version: pkg.version,
      path,
    });
  }

  return ok(dependencies);
}

export { parseNpmLockfile };
export type { Dependency };
