/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts
 */

import { PnpmLockfileResolutionSchema } from "@/pnpm/schemas/lockfile/resolution";

import * as z from "zod";

export const PnpmLockfilePackageInfoSchema = z.object({
  id: z.string().optional(),
  patched: z.boolean().optional(),
  hasBin: z.boolean().optional(),
  /**
   * From @pnpm/lockfile.types source code:
   * "name and version are only needed for packages that are hosted not in the npm registry"
   * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L44
   */
  name: z.string().optional(),
  version: z.string().optional(),
  resolution: PnpmLockfileResolutionSchema,
  peerDependencies: z.record(z.string(), z.string()).optional(),
  peerDependenciesMeta: z
    .record(
      z.string(),
      z.object({
        optional: z.literal(true),
      })
    )
    .optional(),
  bundledDependencies: z.union([z.array(z.string()), z.boolean()]).optional(),
  /**
   * According to the source code, if the engines field exists, it must have a node property.
   * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L58
   * However, from our runtime tests, it is possible for this field to exist without a node property.
   * For example, see the concat-stream@2.0.0 package in pnpm's pnpm-lock.yaml file.
   * @see https://github.com/pnpm/pnpm/blob/main/pnpm-lock.yaml#L12186
   */
  engines: z
    .intersection(
      z.record(z.string(), z.string()),
      z.object({
        node: z.string().optional(), // <--- This is required in the pnpm's type definitions
      })
    )
    .optional(),
  os: z.array(z.string()).optional(),
  cpu: z.array(z.string()).optional(),
  libc: z.array(z.string()).optional(),
  deprecated: z.string().optional(),
});
export type PnpmLockfilePackageInfo = z.infer<
  typeof PnpmLockfilePackageInfoSchema
>;
