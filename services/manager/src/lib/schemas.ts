import * as z from "zod";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";

export const WatchReportEndpointInputSchema = z.object({
  packages: z.array(
    z.object({
      name: NpmPackageNameSchema,
      version: SemverSchema,
      previousVersion: SemverSchema,
    })
  ),
});
export type WatchReportEndpointInput = z.infer<
  typeof WatchReportEndpointInputSchema
>;
