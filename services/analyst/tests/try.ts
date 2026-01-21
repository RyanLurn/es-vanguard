import { findDistObjects } from "#components/find-dist-objects";
import { generateDiff } from "#components/generate-diff";
import { getFiles } from "#components/get-files";
import { getPackageMetadata } from "#components/get-package-metadata";
import { getTarball } from "#components/get-tarball";
import { verifyTarball } from "#components/verify-tarball";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";

const packageName = "next" as NpmPackageName;
const targetVersion = "16.0.0" as Semver;
const baseVersion = "15.0.0" as Semver;

console.log("Fetching package metadata...");
const getPackageMetadataStartTime = Bun.nanoseconds();
const getPackageMetadataResult = await getPackageMetadata({ packageName });
if (getPackageMetadataResult.isErr()) {
  throw getPackageMetadataResult.error;
}
const packageMetadata = getPackageMetadataResult.value;
const getPackageMetadataEndTime = Bun.nanoseconds();
console.log(
  `Package metadata fetched in ${
    (getPackageMetadataEndTime - getPackageMetadataStartTime) / 1_000_000_000
  } seconds`
);

console.log("Finding dist objects...");
const findDistObjectsResult = findDistObjects({
  name: packageName,
  target: targetVersion,
  base: baseVersion,
  packageMetadata,
});
if (findDistObjectsResult.isErr()) {
  throw findDistObjectsResult.error;
}
const { targetDist, baseDist } = findDistObjectsResult.value;

console.log("Fetching tarballs...");
const fetchTarballStartTime = Bun.nanoseconds();
const [targetTarball, baseTarball] = await Promise.all([
  fetch(targetDist.tarball).then((response) => response.blob()),
  fetch(baseDist.tarball).then((response) => response.blob()),
]);
const fetchTarballEndTime = Bun.nanoseconds();
console.log(
  `Tarballs fetched in ${
    (fetchTarballEndTime - fetchTarballStartTime) / 1_000_000_000
  } seconds`
);

const verifiedTargetTarball = verifyTarball({
  tarball: targetTarball,
  distObject: targetDist,
});
if (verifiedTargetTarball.isErr()) {
  throw verifiedTargetTarball.error;
}
const verifiedBaseTarball = verifyTarball({
  tarball: baseTarball,
  distObject: baseDist,
});
if (verifiedBaseTarball.isErr()) {
  throw verifiedBaseTarball.error;
}

console.log("Extracting files...");
const untarStartTime = Bun.nanoseconds();
const [targetFilesResult, baseFilesResult] = await Promise.all([
  getFiles({ tarball: verifiedTargetTarball.value }),
  getFiles({ tarball: verifiedBaseTarball.value }),
]);

if (targetFilesResult.isErr()) {
  throw targetFilesResult.error;
}
if (baseFilesResult.isErr()) {
  throw baseFilesResult.error;
}
const targetFiles = targetFilesResult.value;
const baseFiles = baseFilesResult.value;
const untarEndTime = Bun.nanoseconds();
console.log(
  `Files extracted in ${(untarEndTime - untarStartTime) / 1_000_000_000} seconds`
);

console.log("Generating diff...");
const generateDiffStartTime = Bun.nanoseconds();
const diff = await generateDiff({
  targetVersion,
  baseVersion,
  targetFiles,
  baseFiles,
});
const generateDiffEndTime = Bun.nanoseconds();
console.log(
  `Diff generated in ${(generateDiffEndTime - generateDiffStartTime) / 1_000_000_000} seconds`
);

await Bun.write("diff.txt", diff);
console.log("Done.");
