import type { Dependency } from "@/lib/types";
import type { PnpmDependencyList } from "@/pnpm/schema";
import { parsePnpmDependency } from "@/pnpm/utils/parse-dependency";

export function parsePnpmDependencyList(
  pathPrefix: string,
  dependencyListObject: PnpmDependencyList
) {
  const parsedDependencyList: Array<
    Dependency & { peerDependencies?: string }
  > = [];
  for (const [name, { specifier, version }] of Object.entries(
    dependencyListObject
  )) {
    const parseDependencyResult = parsePnpmDependency({
      name,
      specifier,
      version,
    });

    if (parseDependencyResult.isErr()) {
      continue;
    }

    const {
      name: dependencyName,
      version: dependencyVersion,
      aliasName,
      peerDependencies,
    } = parseDependencyResult.value;
    parsedDependencyList.push({
      name: dependencyName,
      version: dependencyVersion,
      path: `${pathPrefix}/${aliasName ?? dependencyName}`,
      peerDependencies,
    });
  }

  return parsedDependencyList;
}
