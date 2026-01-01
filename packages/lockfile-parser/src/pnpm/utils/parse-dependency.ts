import { UnexpectedError, ExpectedError } from "@/lib/errors";
import { type Semver, SemverRangeSchema } from "@/lib/semver-schemas";
import type { PnpmDependency } from "@/pnpm/schema";
import { parsePnpmDependencyVersion } from "@/pnpm/utils/parse-version";
import { type Result, err, ok } from "neverthrow";

export function parsePnpmDependency({
  name,
  specifier,
  version,
}: { name: string } & PnpmDependency): Result<
  {
    name: string;
    version: Semver;
    specifier: string;
    aliasName?: string;
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
          aliasName: name,
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
    if (
      !specifier.startsWith("catalog:") &&
      !specifier.startsWith("workspace:")
    ) {
      console.warn("Unknown specifier format:", specifier);
    }
    return err(expectedError);
  }
}
