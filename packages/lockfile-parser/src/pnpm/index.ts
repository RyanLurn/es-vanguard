import { ExpectedError, UnexpectedError } from "@/lib/errors";
import {
  SemverRangeSchema,
  SemverSchema,
  type Semver,
} from "@/lib/semver-schemas";
import type { Dependency } from "@/lib/types";
import {
  PnpmLockfileV9Schema,
  type PnpmDependency,
  type PnpmDependencyList,
} from "@/pnpm/schema";
import { parsePnpmDependencyList } from "@/pnpm/utils/parse-dependency-list";
import { parseSnapshotDependencyVersion } from "@/pnpm/utils/parse-version";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { err, ok, type Result } from "neverthrow";

export async function parsePnpmLockfile(
  content: string
): Promise<Result<Dependency[], Error>> {
  const parseYamlResult = await safeYamlParse({
    text: content,
    schema: PnpmLockfileV9Schema,
  });

  if (parseYamlResult.isErr()) {
    return err(parseYamlResult.error);
  }

  const lockfile = parseYamlResult.value;
  const directDependencies: Array<Dependency & { peerDependencies?: string }> =
    [];
  const dependenciesOfDependencies: Dependency[] = [];

  // Parse catalogs
  if (lockfile.catalogs) {
    for (const [catalogName, catalogDependencyList] of Object.entries(
      lockfile.catalogs
    )) {
      const parsedCatalogDependencyList = parsePnpmDependencyList(
        `catalogs/${catalogName}`,
        catalogDependencyList
      );

      directDependencies.push(...parsedCatalogDependencyList);
    }
  }

  // Parse importers
  for (const [projectName, project] of Object.entries(lockfile.importers)) {
    // Process dependencies
    if (project.dependencies) {
      const parsedDependencyList = parsePnpmDependencyList(
        `importers/${projectName}/dependencies`,
        project.dependencies
      );

      directDependencies.push(...parsedDependencyList);
    }

    // Process devDependencies
    if (project.devDependencies) {
      const parsedDependencyList = parsePnpmDependencyList(
        `importers/${projectName}/devDependencies`,
        project.devDependencies
      );

      directDependencies.push(...parsedDependencyList);
    }

    // Process optionalDependencies
    if (project.optionalDependencies) {
      const parsedDependencyList = parsePnpmDependencyList(
        `importers/${projectName}/optionalDependencies`,
        project.optionalDependencies
      );

      directDependencies.push(...parsedDependencyList);
    }
  }

  for (const directDependency of directDependencies) {
    const snapshotKey = `${directDependency.name}@${directDependency.version}${directDependency.peerDependencies ?? ""}`;
    const directDependencySnapshot = lockfile.snapshots[snapshotKey];

    if (directDependencySnapshot) {
      const { dependencies, optionalDependencies } = directDependencySnapshot;
      for (const [name, version] of Object.entries(dependencies || {})) {
        const parseSnapshotDependencyVersionResult =
          parseSnapshotDependencyVersion(version);
        if (parseSnapshotDependencyVersionResult.isErr()) {
          console.warn(
            "Could not parse snapshot dependency:",
            { name, version },
            "from snapshot:",
            snapshotKey
          );
          continue;
        }

        const { name: validName, version: validVersion } =
          parseSnapshotDependencyVersionResult.value;
        dependenciesOfDependencies.push({
          name: validName ?? name,
          version: validVersion,
          path: `${directDependency.path}/dependencies/${name}`,
        });
      }
      for (const [name, version] of Object.entries(
        optionalDependencies || {}
      )) {
        const parseSnapshotDependencyVersionResult =
          parseSnapshotDependencyVersion(version);
        if (parseSnapshotDependencyVersionResult.isErr()) {
          console.warn(
            "Could not parse snapshot dependency:",
            { name, version },
            "from snapshot:",
            snapshotKey
          );
          continue;
        }

        const { name: validName, version: validVersion } =
          parseSnapshotDependencyVersionResult.value;
        dependenciesOfDependencies.push({
          name: validName ?? name,
          version: validVersion,
          path: `${directDependency.path}/optionalDependencies/${name}`,
        });
      }
    } else {
      let foundSnapshot = false;
      for (const [snapshotKey, snapshot] of Object.entries(
        lockfile.snapshots
      )) {
        if (
          snapshotKey.startsWith(
            `${directDependency.name}@${directDependency.version}`
          )
        ) {
          foundSnapshot = true;
          const { dependencies, optionalDependencies } = snapshot;
          for (const [name, version] of Object.entries(dependencies || {})) {
            const parseSnapshotDependencyVersionResult =
              parseSnapshotDependencyVersion(version);
            if (parseSnapshotDependencyVersionResult.isErr()) {
              console.warn(
                "Could not parse snapshot dependency:",
                { name, version },
                "from snapshot:",
                snapshotKey
              );
              continue;
            }

            const { name: validName, version: validVersion } =
              parseSnapshotDependencyVersionResult.value;
            dependenciesOfDependencies.push({
              name: validName ?? name,
              version: validVersion,
              path: `${directDependency.path}/dependencies/${name}`,
            });
          }
          for (const [name, version] of Object.entries(
            optionalDependencies || {}
          )) {
            const parseSnapshotDependencyVersionResult =
              parseSnapshotDependencyVersion(version);
            if (parseSnapshotDependencyVersionResult.isErr()) {
              console.warn(
                "Could not parse snapshot dependency:",
                { name, version },
                "from snapshot:",
                snapshotKey
              );
              continue;
            }

            const { name: validName, version: validVersion } =
              parseSnapshotDependencyVersionResult.value;
            dependenciesOfDependencies.push({
              name: validName ?? name,
              version: validVersion,
              path: `${directDependency.path}/optionalDependencies/${name}`,
            });
          }
        }
      }
      if (!foundSnapshot) {
        console.warn(
          "Could not find snapshot for direct dependency:",
          directDependency
        );
      }
    }
  }

  const dependencies = [...directDependencies, ...dependenciesOfDependencies];

  return ok(dependencies);
}
