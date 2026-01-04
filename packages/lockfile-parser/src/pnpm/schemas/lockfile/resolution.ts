/**
 * The content of this file is based on pnpm's lockfile type definitions.
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts
 */

import { PnpmPlatformAssetTargetSchema } from "@/pnpm/schemas/others";
import * as z from "zod";

/**
 * From @pnpm/lockfile.types source code:
 * "tarball hosted remotely"
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L86
 */
export const PnpmTarballResolutionSchema = z.object({
  type: z.undefined().optional(),
  tarball: z.string(),
  integrity: z.string().optional(),
  path: z.string().optional(),
});
export type PnpmTarballResolution = z.infer<typeof PnpmTarballResolutionSchema>;

/**
 * From @pnpm/lockfile.types source code:
 * "directory on a file system"
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L96
 */
export const PnpmDirectoryResolutionSchema = z.object({
  type: z.literal("directory"),
  directory: z.string(),
});
export type PnpmDirectoryResolution = z.infer<
  typeof PnpmDirectoryResolutionSchema
>;

/**
 * From @pnpm/lockfile.types source code:
 * "Git repository"
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L104
 */
export const PnpmGitRepositoryResolutionSchema = z.object({
  type: z.literal("git"),
  repo: z.string(),
  commit: z.string(),
  path: z.string().optional(),
});
export type PnpmGitRepositoryResolution = z.infer<
  typeof PnpmGitRepositoryResolutionSchema
>;

export const PnpmBinaryResolutionSchema = z.object({
  type: z.literal("binary"),
  url: z.string(),
  integrity: z.string(),
  bin: z.string(),
  archive: z.enum(["zip", "tarball"]),
});
export type PnpmBinaryResolution = z.infer<typeof PnpmBinaryResolutionSchema>;

/**
 * From @pnpm/lockfile.types source code:
 * "Custom resolution type for custom resolver-provided packages.
 * The type field must be prefixed with 'custom:' to differentiate it from built-in resolution types.
 *
 * Example: { type: 'custom:cdn', cdnUrl: '...' }""
 * @see https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts#L127
 */
export const PnpmCustomResolutionSchema = z.looseObject({
  type: z.custom<`custom:${string}`>((value) => {
    if (typeof value !== "string") {
      return false;
    }
    if (!value.startsWith("custom:")) {
      return false;
    }
    return true;
  }),
});
export type PnpmCustomResolution = z.infer<typeof PnpmCustomResolutionSchema>;

export const PnpmResolutionSchema = z.union([
  PnpmTarballResolutionSchema,
  PnpmDirectoryResolutionSchema,
  PnpmGitRepositoryResolutionSchema,
  PnpmBinaryResolutionSchema,
  PnpmCustomResolutionSchema,
]);
export type PnpmResolution = z.infer<typeof PnpmResolutionSchema>;

export const PnpmPlatformAssetResolutionSchema = z.object({
  resolution: PnpmResolutionSchema,
  targets: z.array(PnpmPlatformAssetTargetSchema),
});
export type PnpmPlatformAssetResolution = z.infer<
  typeof PnpmPlatformAssetResolutionSchema
>;

export const PnpmVariationsResolutionSchema = z.object({
  type: z.literal("variations"),
  variants: z.array(PnpmPlatformAssetResolutionSchema),
});
export type PnpmVariationsResolution = z.infer<
  typeof PnpmVariationsResolutionSchema
>;

export const PnpmLockfileResolutionSchema = z.union([
  PnpmResolutionSchema,
  PnpmVariationsResolutionSchema,
  z.object({
    integrity: z.string(),
  }),
]);
export type PnpmLockfileResolution = z.infer<
  typeof PnpmLockfileResolutionSchema
>;
