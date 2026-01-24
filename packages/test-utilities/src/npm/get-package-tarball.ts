import { getResource } from "#get-resource.ts";
import { getPackageMetadata } from "#npm/get-package-metadata.ts";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { err, ok, Result } from "neverthrow";

export async function getPackageTarball({
  packageName,
  version,
}: {
  packageName: NpmPackageName;
  version: Semver;
}): Promise<Result<Blob, unknown>> {
  const getPackageMetadataResult = await getPackageMetadata({
    packageName,
  });

  if (getPackageMetadataResult.isErr()) {
    return err(getPackageMetadataResult.error);
  }

  const packageMetadata = getPackageMetadataResult.value;

  const tarballURL = packageMetadata.versions[version]?.dist.tarball;
  if (!tarballURL) {
    return err(
      new Error(`Version ${version} not found for package ${packageName}`)
    );
  }

  // Download the tarball
  const tarballResult = await getResource({
    url: tarballURL,
    responseType: "blob",
    fileExtension: "tar.gz",
  });

  if (tarballResult.isErr()) {
    return err(tarballResult.error);
  }

  const tarball = tarballResult.value.data;
  if (!(tarball instanceof Blob)) {
    return err(new Error("Expected Blob"));
  }

  return ok(tarball);
}
