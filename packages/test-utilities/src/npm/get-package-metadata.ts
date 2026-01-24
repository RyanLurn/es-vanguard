import { getResource } from "#get-resource.ts";
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
  prefix,
}: {
  packageName: NpmPackageName;
  prefix?: string;
}): Promise<Result<PackageMetadata, unknown>> {
  const url = `${NPM_REGISTRY_URL}/${packageName}`;
  const getResourceResult = await getResource({
    url,
    responseType: "json",
    fileExtension: "json",
    headers: {
      Accept: ABBREVIATED_METADATA_ACCEPT_HEADER,
    },
    prefix,
  });

  if (getResourceResult.isErr()) {
    return err(getResourceResult.error);
  }

  const { data } = getResourceResult.value;

  const validationResult = PackageMetadataSchema.safeParse(data);

  if (!validationResult.success) {
    return err(validationResult.error);
  }

  return ok(validationResult.data);
}
