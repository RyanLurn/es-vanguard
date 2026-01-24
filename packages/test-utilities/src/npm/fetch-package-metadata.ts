import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
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
