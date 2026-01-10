import type { LogStep } from "@/contexts";
import type {
  ValidateInputsContext,
  ValidInputs,
} from "@/utils/inputs/validate";
import { createFallbackError } from "@es-vanguard/utils/errors/fallback";
import {
  ABBREVIATED_METADATA_ACCEPT_HEADER,
  NPM_REGISTRY_URL,
} from "@es-vanguard/utils/npm-constants";
import { NpmPackageNameSchema } from "@es-vanguard/utils/npm-package-name";
import { SemverSchema } from "@es-vanguard/utils/semver";
import * as z from "zod";

const PackageMetadataSchema = z.looseObject({
  name: NpmPackageNameSchema,
  versions: z.record(
    SemverSchema,
    z.looseObject({
      name: NpmPackageNameSchema,
      version: SemverSchema,
      dist: z.looseObject({
        tarball: z.url(),
        shasum: z.string().optional(),
        integrity: z.string().optional(),
      }),
      _hasShrinkwrap: z.boolean().optional(),
      hasInstallScript: z.boolean().optional(),
    })
  ),
});
export type PackageMetadata = z.infer<typeof PackageMetadataSchema>;

type GetMetadataStep = LogStep<"get-metadata", PackageMetadata>;
export interface GetMetadataContext extends Omit<
  ValidateInputsContext,
  "steps"
> {
  steps: [...ValidateInputsContext["steps"], GetMetadataStep];
}

export async function getMetadata({
  validInputs,
  context,
}: {
  validInputs: ValidInputs;
  context: ValidateInputsContext;
}) {
  const startTime = Bun.nanoseconds();
  try {
    const response = await fetch(`${NPM_REGISTRY_URL}/${validInputs.name}`, {
      headers: {
        Accept: ABBREVIATED_METADATA_ACCEPT_HEADER,
      },
    });
  } catch (error) {
    const fallbackError = createFallbackError(error);
  }
}
