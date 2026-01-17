import type {
  DistObject,
  PackageMetadata,
} from "#components/get-package-metadata";
import type { Inputs } from "#components/parse-inputs";
import type { DEFAULT_BASE_VERSION } from "#utils/constants";
import { getBaseVersion } from "#utils/get-base-version";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { err, ok, Result } from "neverthrow";

interface FindDistObjectsParams extends Inputs {
  packageMetadata: PackageMetadata;
}

interface NotFoundDist {
  name: NpmPackageName;
  version: "target" | "base";
  selector: Semver | typeof DEFAULT_BASE_VERSION;
}

export function findDistObjects({
  name,
  target,
  base,
  packageMetadata,
}: FindDistObjectsParams): Result<
  { targetDist: DistObject; baseDist: DistObject },
  NotFoundDist
> {
  const targetDist = packageMetadata.versions[target]?.dist;

  if (!targetDist) {
    const notFoundTargetDist: NotFoundDist = {
      name,
      version: "target",
      selector: target,
    };
    return err(notFoundTargetDist);
  }

  const versions = Object.keys(packageMetadata.versions) as Semver[];
  const baseVersion = getBaseVersion({ target, base, versions });

  if (!baseVersion) {
    const notFoundBaseDist: NotFoundDist = {
      name,
      version: "base",
      selector: base,
    };
    return err(notFoundBaseDist);
  }

  const baseDist = packageMetadata.versions[baseVersion]?.dist;

  if (!baseDist) {
    const notFoundBaseDist: NotFoundDist = {
      name,
      version: "base",
      selector: baseVersion,
    };
    return err(notFoundBaseDist);
  }

  return ok({ targetDist, baseDist });
}
