import { betterFetch } from "@better-fetch/fetch";
import {
  serializeUnknown,
  type SerializedFallback,
} from "@es-vanguard/telemetry/errors/serialize-unknown";
import {
  ABBREVIATED_METADATA_ACCEPT_HEADER,
  NPM_REGISTRY_URL,
} from "@es-vanguard/utils/npm-constants";
import {
  NpmPackageNameSchema,
  type NpmPackageName,
} from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import { err, ok, Result } from "neverthrow";
import * as z from "zod";

const distObjectSchema = z.looseObject({
  tarball: z.url(),
  shasum: z.string().optional(),
  integrity: z.string().optional(),
});
export type DistObject = z.infer<typeof distObjectSchema>;

export const PackageMetadataSchema = z.looseObject({
  name: NpmPackageNameSchema,
  versions: z.record(
    SemverSchema,
    z.looseObject({
      name: NpmPackageNameSchema,
      version: SemverSchema,
      dist: distObjectSchema,
      _hasShrinkwrap: z.boolean().optional(),
      hasInstallScript: z.boolean().optional(),
    })
  ),
});
export type PackageMetadata = z.infer<typeof PackageMetadataSchema>;

export async function getPackageMetadata({
  packageName,
}: {
  packageName: NpmPackageName;
}): Promise<Result<PackageMetadata, Error | SerializedFallback>> {
  try {
    const url = `${NPM_REGISTRY_URL}/${encodeURIComponent(packageName)}`;
    const data = await betterFetch(url, {
      method: "GET",
      headers: {
        Accept: ABBREVIATED_METADATA_ACCEPT_HEADER,
      },
      throw: true,
      output: PackageMetadataSchema,
      timeout: 5000, // 5 seconds
      retry: {
        type: "exponential",
        attempts: 3,
        baseDelay: 500, // 0.5 seconds
        maxDelay: 2000, // 2 seconds
        shouldRetry: (response) => {
          if (response === null) {
            return true;
          }
          if (response.status === 429 || response.status === 503) {
            return true;
          }
          return false;
        },
      },
    });

    return ok(data);
  } catch (error) {
    if (error instanceof Error) {
      return err(error);
    }

    const fallbackError = serializeUnknown(error);
    return err(fallbackError);
  }
}
