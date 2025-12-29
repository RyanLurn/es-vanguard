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

  if (!lockfile.importers && !lockfile.snapshots) {
    return ok([]);
  }

  const dependencies: Dependency[] = [];

  function handleAliasPackage({
    pathPrefix,
    name,
    versionRange,
  }: {
    pathPrefix: string;
    name: string;
    versionRange: string;
  }) {
    if (semver.valid(versionRange)) {
      return {
        name,
        version: versionRange,
        path: `${pathPrefix}/${name}`,
      };
    }

    if (versionRange.startsWith("^") || versionRange.startsWith("~")) {
      // Handle caret and tilde prefixes by extracting the version
      const cleanVersion = versionRange.substring(1);
      if (semver.valid(cleanVersion)) {
        return {
          name,
          version: cleanVersion,
          path: `${pathPrefix}/${name}`,
        };
      }
    }
    return null;
  }

  if (lockfile.catalogs) {
    for (const [catalogName, catalogDependencies] of Object.entries(
      lockfile.catalogs
    )) {
      for (const [packageName, packageInfo] of Object.entries(
        catalogDependencies
      )) {
        const parsePackageResult = parsePackage({
          pathPrefix: `catalogs/${catalogName}`,
          packageName,
          packageSpecifier: packageInfo.specifier,
          packageVersion: packageInfo.version,
        });
        if (parsePackageResult.isOk()) {
          dependencies.push(parsePackageResult.value);
        }
      }
    }
  }

  for (const [projectName, projectSnapshot] of Object.entries(
    // @ts-expect-error
    lockfile.importers
  )) {
    if (projectSnapshot.dependencies) {
      for (const [packageName, packageInfo] of Object.entries(
        projectSnapshot.dependencies
      )) {
        const parsePackageResult = parsePackage({
          pathPrefix: `importers/${projectName}`,
          packageName,
          packageSpecifier: packageInfo.specifier,
          packageVersion: packageInfo.version,
        });
        if (parsePackageResult.isOk()) {
          dependencies.push(parsePackageResult.value);
        }
      }
    }

    if (projectSnapshot.devDependencies) {
      for (const [packageName, packageInfo] of Object.entries(
        projectSnapshot.devDependencies
      )) {
        const parsePackageResult = parsePackage({
          pathPrefix: `importers/${projectName}`,
          packageName,
          packageSpecifier: packageInfo.specifier,
          packageVersion: packageInfo.version,
        });
        if (parsePackageResult.isOk()) {
          dependencies.push(parsePackageResult.value);
        }
      }
    }

    if (projectSnapshot.optionalDependencies) {
      for (const [packageName, packageInfo] of Object.entries(
        projectSnapshot.optionalDependencies
      )) {
        const parsePackageResult = parsePackage({
          pathPrefix: `importers/${projectName}`,
          packageName,
          packageSpecifier: packageInfo.specifier,
          packageVersion: packageInfo.version,
        });
        if (parsePackageResult.isOk()) {
          dependencies.push(parsePackageResult.value);
        }
      }
    }
  }

  return ok(dependencies);
}

function parsePackage({
  pathPrefix,
  packageName,
  packageSpecifier,
  packageVersion,
}: {
  pathPrefix: string;
  packageName: string;
  packageSpecifier: string;
  packageVersion: string;
}): Result<
  Dependency,
  | { code: "ALIAS_PACKAGE"; name: string; versionRange: string }
  | { code: "NOT_NPM_PACKAGE" }
> {
  // Handling alias
  if (packageSpecifier.startsWith("npm:")) {
    const specifierwithoutPrefix = packageSpecifier.replace("npm:", "");
    const lastAtIndex = specifierwithoutPrefix.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const name = specifierwithoutPrefix.substring(0, lastAtIndex);
      const versionRange = specifierwithoutPrefix.substring(lastAtIndex + 1);
      if (semver.validRange(versionRange)) {
        return err({
          code: "ALIAS_PACKAGE",
          name,
          versionRange,
        });
      }
    }

    return err({ code: "NOT_NPM_PACKAGE" });
  }

  const version = getVersionFromResolution(packageVersion);
  if (semver.validRange(packageSpecifier) && version) {
    return ok({
      name: packageName,
      version: version,
      path: `${pathPrefix}/${packageName}`,
    });
  }

  return err({ code: "NOT_NPM_PACKAGE" });
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
