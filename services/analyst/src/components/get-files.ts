import type { VerifiedTarball } from "#components/verify-tarball";
import {
  serializeUnknown,
  type SerializedFallback,
} from "@es-vanguard/telemetry/errors/serialize-unknown";
import { err, ok, Result } from "neverthrow";

export async function getFiles({
  tarball,
}: {
  tarball: VerifiedTarball;
}): Promise<Result<Map<string, File>, Error | SerializedFallback>> {
  try {
    const archive = new Bun.Archive(tarball);
    const archiveFiles = await archive.files();

    const files = new Map<string, File>();
    for (const [rawPath, file] of archiveFiles) {
      const cleanPath = rawPath.replace(/^[^/]+\//, "");
      files.set(cleanPath, file);
    }

    return ok(files);
  } catch (error) {
    if (error instanceof Error) {
      return err(error);
    }

    const fallbackError = serializeUnknown(error);
    return err(fallbackError);
  }
}
