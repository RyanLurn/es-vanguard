import * as z from "zod";

const PnpmDependencySchema = z.object({
  specifier: z.string(),
  version: z.string(),
});

const PnpmDependenciesSchema = z.record(z.string(), PnpmDependencySchema);

const PnpmPackageSchema = z.looseObject({
  dependencies: PnpmDependenciesSchema.optional(),
  devDependencies: PnpmDependenciesSchema.optional(),
});

const PnpmPackagesSchema = z.record(z.string(), PnpmPackageSchema);

const PnpmLockfileZodSchema = z.looseObject({
  lockfileVersion: z.string(),
  settings: z.looseObject({
    autoInstallPeers: z.boolean(),
    excludeLinksFromLockfile: z.boolean(),
  }),
  catalogs: z
    .looseObject({
      default: PnpmDependenciesSchema,
    })
    .optional(),
  overrides: z.record(z.string(), z.string()).optional(),
  importers: PnpmPackagesSchema,
  packages: z.record(
    z.string(),
    z.looseObject({
      resolution: z.any().optional(),
      engines: z.any().optional(),
    })
  ),
});

export {
  PnpmLockfileZodSchema,
  PnpmDependencySchema,
  PnpmDependenciesSchema,
  PnpmPackageSchema,
  PnpmPackagesSchema,
};
