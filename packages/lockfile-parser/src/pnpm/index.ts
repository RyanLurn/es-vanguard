import type { Dependency } from "@/lib/types";
import { PnpmLockfileFileSchema } from "@/pnpm/schemas/lockfile-file";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { err, ok, type Result } from "neverthrow";
import semver from "semver";

async function parsePnpmLockfile(
  content: string
): Promise<Result<Dependency[], Error>> {
  const parseYamlResult = await safeYamlParse({
    text: content,
    schema: PnpmLockfileFileSchema,
  });
  if (parseYamlResult.isErr()) {
    return err(parseYamlResult.error);
  }
  const lockfile = parseYamlResult.value;

  const dependencies: Dependency[] = [];

  if (lockfile.catalogs) {
    for (const [catalogName, catalogDependencies] of Object.entries(
      lockfile.catalogs
    )) {
      for (const [packageName, packageInfo] of Object.entries(
        catalogDependencies
      )) {
        if (semver.validRange(packageInfo.specifier)) {
          dependencies.push({
            name: packageName,
            version: packageInfo.version,
            path: `catalogs/${catalogName}/${packageName}`,
          });
        }
      }
    }
  }

  if (lockfile.importers) {
    for (const [projectName, projectSnapshot] of Object.entries(
      lockfile.importers
    )) {
      if (projectSnapshot.dependencies) {
        for (const [packageName, packageInfo] of Object.entries(
          projectSnapshot.dependencies
        )) {
          const packageVersion = getVersionFromResolution(packageInfo.version);
          if (semver.validRange(packageInfo.specifier) && packageVersion) {
            dependencies.push({
              name: packageName,
              version: packageVersion,
              path: `importers/${projectName}/${packageName}`,
            });
          }
        }
      }

      if (projectSnapshot.devDependencies) {
        for (const [packageName, packageInfo] of Object.entries(
          projectSnapshot.devDependencies
        )) {
          const packageVersion = getVersionFromResolution(packageInfo.version);
          if (semver.validRange(packageInfo.specifier) && packageVersion) {
            dependencies.push({
              name: packageName,
              version: packageVersion,
              path: `importers/${projectName}/${packageName}`,
            });
          }
        }
      }

      if (projectSnapshot.optionalDependencies) {
        for (const [packageName, packageInfo] of Object.entries(
          projectSnapshot.optionalDependencies
        )) {
          const packageVersion = getVersionFromResolution(packageInfo.version);
          if (semver.validRange(packageInfo.specifier) && packageVersion) {
            dependencies.push({
              name: packageName,
              version: packageVersion,
              path: `importers/${projectName}/${packageName}`,
            });
          }
        }
      }
    }
  }

  return ok(dependencies);
}

function getVersionFromResolution(resolution: string) {
  const segments = resolution.split("(");
  const version = segments[0];
  if (version && semver.valid(version)) {
    return version;
  }
  return null;
}

export { parsePnpmLockfile };
