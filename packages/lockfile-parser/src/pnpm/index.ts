import { ExpectedError, UnexpectedError } from "@/lib/errors";
import type { Dependency } from "@/lib/types";
import { PnpmLockfileV9Schema } from "@/pnpm/schema";
import { parsePnpmLockfileV9SnapshotKey } from "@/pnpm/utils/parse-snapshot-key";
import { safeYamlParse } from "@es-vanguard/yaml-parser";
import { err, ok, type Result } from "neverthrow";

export async function parsePnpmLockfile(
  content: string
): Promise<Result<Dependency[], ExpectedError | UnexpectedError>> {
  const dependencies: Dependency[] = [];

  const parseYamlResult = await safeYamlParse({
    text: content,
    schema: PnpmLockfileV9Schema,
  });

  if (parseYamlResult.isErr()) {
    const parseYamlError = new ExpectedError(parseYamlResult.error.message, {
      cause: parseYamlResult.error.cause,
    });
    return err(parseYamlError);
  }

  const lockfile = parseYamlResult.value;

  for (const [snapshotKey, _snapshotValue] of Object.entries(
    lockfile.snapshots
  )) {
    const parseSnapshotKeyResult = parsePnpmLockfileV9SnapshotKey({
      snapshotKey,
    });

    if (parseSnapshotKeyResult.isErr()) {
      if (parseSnapshotKeyResult.error instanceof ExpectedError) {
        console.warn(parseSnapshotKeyResult.error.message);
      } else {
        console.error(parseSnapshotKeyResult.error.message);
      }
      continue;
    }

    const { npmPackageName, npmPackageVersion } = parseSnapshotKeyResult.value;

    dependencies.push({
      name: npmPackageName,
      version: npmPackageVersion,
    });
  }

  return ok(dependencies);
}
