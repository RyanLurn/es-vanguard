import { ExpectedError, UnexpectedError } from "@/lib/errors";
import {
  SemverRangeSchema,
  SemverSchema,
  type Semver,
} from "@/lib/semver-schemas";
import type { Dependency } from "@/lib/types";
import { PnpmLockfileV9Schema, type PnpmDependency } from "@/pnpm/schema";
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
  const dependencies: Dependency[] = [];

  return ok(dependencies);
}

export function parsePnpmDependency({
  name,
  specifier,
  version,
}: { name: string } & PnpmDependency): Result<
  {
    name: string;
    version: Semver;
    specifier: string;
    peerDependencies?: string;
  },
  UnexpectedError | ExpectedError
> {
  const parseSpecifierResult = SemverRangeSchema.safeParse(specifier);

  if (parseSpecifierResult.success) {
    const parseVersionResult = parsePnpmDependencyVersion(version);
    if (parseVersionResult.isErr()) {
      const error = new UnexpectedError(parseVersionResult.error.message, {
        cause: parseVersionResult.error,
        context: {
          name,
          specifier,
          version,
        },
      });
      return err(error);
    } else {
      return ok({
        ...parseVersionResult.value,
        name,
        specifier,
      });
    }
  } else if (specifier.startsWith("npm:")) {
    // Handle alias package
    const npmPackage = specifier.replace("npm:", "");
    const lastAtIndex = npmPackage.lastIndexOf("@");
    if (lastAtIndex === -1) {
      const error = new UnexpectedError("Unexpected npm package format", {
        context: {
          name,
          specifier,
          version,
        },
      });
      return err(error);
    } else {
      const npmPackageName = npmPackage.substring(0, lastAtIndex);
      const parseVersionResult = parsePnpmDependencyVersion(version);
      if (parseVersionResult.isErr()) {
        const error = new UnexpectedError(parseVersionResult.error.message, {
          cause: parseVersionResult.error,
          context: {
            name,
            specifier,
            version,
          },
        });
        return err(error);
      } else {
        return ok({
          ...parseVersionResult.value,
          name: npmPackageName,
          specifier,
        });
      }
    }
  } else {
    const expectedError = new ExpectedError(
      `Unsupported specifier format: ${specifier}`,
      {
        context: {
          name,
          specifier,
          version,
        },
      }
    );
    return err(expectedError);
  }
}

export function parsePnpmDependencyVersion(
  version: string
): Result<{ version: Semver; peerDependencies?: string }, UnexpectedError> {
  const peerDependenciesStartIndex = version.indexOf("(");
  if (peerDependenciesStartIndex === -1) {
    const parseVersionResult = SemverSchema.safeParse(version);
    if (parseVersionResult.success) {
      return ok({
        version: parseVersionResult.data,
      });
    } else {
      const unexpectedValidationError = new UnexpectedError(
        `Unexpected version format: ${version}`,
        {
          cause: parseVersionResult.error,
          context: {
            version,
          },
        }
      );
      return err(unexpectedValidationError);
    }
  } else {
    const peerDependencies = version.substring(peerDependenciesStartIndex);
    const versionWithoutPeers = version.substring(
      0,
      peerDependenciesStartIndex
    );
    const parseVersionResult = SemverSchema.safeParse(versionWithoutPeers);

    if (parseVersionResult.success) {
      return ok({
        version: parseVersionResult.data,
        peerDependencies,
      });
    } else {
      const unexpectedValidationError = new UnexpectedError(
        `Unexpected version format: ${version}`,
        {
          cause: parseVersionResult.error,
          context: {
            version,
          },
        }
      );
      return err(unexpectedValidationError);
    }
  }
}
