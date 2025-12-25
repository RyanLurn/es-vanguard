/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts
 */

import { PnpmPatchFileSchema } from "@/pnpm/schemas/others";

import * as z from "zod";

const PnpmResolvedCatalogEntrySchema = z
  .object({
    specifier: z.string(),
    version: z.string(),
  })
  .readonly();
type PnpmResolvedCatalogEntry = z.infer<typeof PnpmResolvedCatalogEntrySchema>;

const PnpmCatalogSnapshotsSchema = z.record(
  z.string(),
  z.record(z.string(), PnpmResolvedCatalogEntrySchema)
);
type PnpmCatalogSnapshots = z.infer<typeof PnpmCatalogSnapshotsSchema>;

const PnpmLockfileSettingsSchema = z.object({
  autoInstallPeers: z.boolean().optional(),
  excludeLinksFromLockfile: z.boolean().optional(),
  peersSuffixMaxLength: z.number().optional(),
  injectWorkspacePackages: z.boolean().optional(),
});
type PnpmLockfileSettings = z.infer<typeof PnpmLockfileSettingsSchema>;

const PnpmLockfileBaseSchema = z.object({
  catalogs: PnpmCatalogSnapshotsSchema.optional(),
  ignoredOptionalDependencies: z.array(z.string()).optional(),
  lockfileVersion: z.string(),
  overrides: z.record(z.string(), z.string()).optional(),
  packageExtensionsChecksum: z.string().optional(),
  patchedDependencies: z.record(z.string(), PnpmPatchFileSchema).optional(),
  pnpmfileChecksum: z.string().optional(),
  settings: PnpmLockfileSettingsSchema.optional(),
  time: z.record(z.string(), z.string()).optional(),
});
type PnpmLockfileBase = z.infer<typeof PnpmLockfileBaseSchema>;

export {
  PnpmLockfileBaseSchema,
  PnpmResolvedCatalogEntrySchema,
  PnpmCatalogSnapshotsSchema,
  PnpmLockfileSettingsSchema,
};
export type {
  PnpmLockfileBase,
  PnpmResolvedCatalogEntry,
  PnpmCatalogSnapshots,
  PnpmLockfileSettings,
};
