/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/lockfileFileTypes.ts
 */

import { PnpmLockfileBaseSchema } from "@/pnpm/schemas/lockfile-base";
import { PnpmLockfilePackageInfoSchema } from "@/pnpm/schemas/lockfile-file/package-info";
import { PnpmLockfilePackageSnapshotSchema } from "@/pnpm/schemas/lockfile-file/package-snapshot";
import { PnpmLockfileFileProjectSnapshotSchema } from "@/pnpm/schemas/lockfile-file/project-snapshot";
import * as z from "zod";

export const PnpmLockfileFileSchema = z.object({
  ...PnpmLockfileBaseSchema.shape,
  importers: z
    .record(z.string(), PnpmLockfileFileProjectSnapshotSchema)
    .optional(),
  packages: z.record(z.string(), PnpmLockfilePackageInfoSchema).optional(),
  snapshots: z.record(z.string(), PnpmLockfilePackageSnapshotSchema).optional(),
});
export type PnpmLockfileFile = z.infer<typeof PnpmLockfileFileSchema>;
