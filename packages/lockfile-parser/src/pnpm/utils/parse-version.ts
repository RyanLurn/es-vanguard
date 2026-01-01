import { UnexpectedError } from "@/lib/errors";
import { type Semver, SemverSchema } from "@/lib/semver-schemas";
import { type Result, ok, err } from "neverthrow";

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

export function parseSnapshotDependencyVersion(
  version: string
): Result<
  { name?: string; version: Semver; peerDependencies?: string },
  UnexpectedError
> {
  const parseDependencyResult = parsePnpmDependencyVersion(version);
  if (parseDependencyResult.isOk()) {
    return ok(parseDependencyResult.value);
  }

  const lastAtIndex = version.lastIndexOf("@");
  if (lastAtIndex === -1) {
    const error = new UnexpectedError(
      "Unexpected snapshot dependency version format",
      {
        context: {
          version,
        },
      }
    );
    return err(error);
  } else {
    const name = version.substring(0, lastAtIndex);
    const parseVersionResult = SemverSchema.safeParse(
      version.substring(lastAtIndex + 1)
    );
    if (!parseVersionResult.success) {
      const error = new UnexpectedError(parseVersionResult.error.message, {
        cause: parseVersionResult.error,
        context: {
          name,
          version,
        },
      });
      return err(error);
    } else {
      return ok({
        name,
        version: parseVersionResult.data,
      });
    }
  }
}
