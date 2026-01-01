import { ExpectedError, UnexpectedError } from "@/lib/errors";
import { SemverSchema, type Semver } from "@/lib/semver-schemas";
import { parsePnpmLockfilePeers } from "@/pnpm/utils/parse-peers";
import { err, ok, type Result } from "neverthrow";

export function parsePnpmLockfileV9SnapshotKey({
  snapshotKey,
}: {
  snapshotKey: string;
}): Result<
  { npmPackageName: string; npmPackageVersion: Semver },
  ExpectedError | UnexpectedError
> {
  let npmPackageSpecifier = snapshotKey;

  const parsePeersResult = parsePnpmLockfilePeers({ text: snapshotKey });

  if (parsePeersResult) {
    npmPackageSpecifier = parsePeersResult.textWithoutPeers;
  }

  const lastAtIndex = npmPackageSpecifier.lastIndexOf("@");

  if (lastAtIndex === -1) {
    return err(
      new UnexpectedError(
        `Invalid package specifier found in pnpm lockfile v9 snapshot key: ${snapshotKey}`
      )
    );
  }

  const npmPackageName = npmPackageSpecifier.substring(0, lastAtIndex);
  const npmPackageVersion = npmPackageSpecifier.substring(lastAtIndex + 1);

  const parseVersionResult = SemverSchema.safeParse(npmPackageVersion);
  if (!parseVersionResult.success) {
    if (npmPackageVersion.startsWith("file:")) {
      return err(
        new ExpectedError("Local file dependencies are not supported", {
          context: {
            snapshotKey,
            specifier: npmPackageVersion,
          },
        })
      );
    }

    if (
      npmPackageVersion.startsWith("http:") ||
      npmPackageVersion.startsWith("https:")
    ) {
      return err(
        new ExpectedError("Remote dependencies are not supported", {
          context: {
            snapshotKey,
            specifier: npmPackageVersion,
          },
        })
      );
    }

    return err(
      new UnexpectedError(
        `Invalid package version found in pnpm lockfile v9 snapshot key: ${snapshotKey}`
      )
    );
  }

  return ok({
    npmPackageName,
    npmPackageVersion: parseVersionResult.data,
  });
}
