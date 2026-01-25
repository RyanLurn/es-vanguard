import { generateDiff } from "#components/generate-diff";
import { getFiles } from "#components/get-files";
import type { VerifiedTarball } from "#components/verify-tarball";
import { getPackageTarball } from "@es-vanguard/test-utilities/get-package-tarball";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";

const packageName = "react-dom" as NpmPackageName;
const targetVersion = "19.2.3" as Semver;
const basePatchVersion = "19.2.2" as Semver;
const baseMinorVersion = "19.1.0" as Semver;
const baseMajorVersion = "18.0.0" as Semver;

// Getting tarballs
console.log("Getting tarballs...");
const getTarballsStartTime = Bun.nanoseconds();
const targetVersionTarballPromise = getPackageTarball({
  packageName,
  version: targetVersion,
});
const basePatchVersionTarballPromise = getPackageTarball({
  packageName,
  version: basePatchVersion,
});
const baseMinorVersionTarballPromise = getPackageTarball({
  packageName,
  version: baseMinorVersion,
});
const baseMajorVersionTarballPromise = getPackageTarball({
  packageName,
  version: baseMajorVersion,
});
const [
  getTargetVersionTarballResult,
  getBasePatchVersionTarballResult,
  getBaseMinorVersionTarballResult,
  getBaseMajorVersionTarballResult,
] = await Promise.all([
  targetVersionTarballPromise,
  basePatchVersionTarballPromise,
  baseMinorVersionTarballPromise,
  baseMajorVersionTarballPromise,
]);

if (getTargetVersionTarballResult.isErr()) {
  console.error(getTargetVersionTarballResult.error);
}
if (getBasePatchVersionTarballResult.isErr()) {
  console.error(getBasePatchVersionTarballResult.error);
}
if (getBaseMinorVersionTarballResult.isErr()) {
  console.error(getBaseMinorVersionTarballResult.error);
}
if (getBaseMajorVersionTarballResult.isErr()) {
  console.error(getBaseMajorVersionTarballResult.error);
}
if (
  getTargetVersionTarballResult.isErr() ||
  getBasePatchVersionTarballResult.isErr() ||
  getBaseMinorVersionTarballResult.isErr() ||
  getBaseMajorVersionTarballResult.isErr()
) {
  process.exit(1);
}

const targetVersionTarball =
  getTargetVersionTarballResult.value as VerifiedTarball;
const basePatchVersionTarball =
  getBasePatchVersionTarballResult.value as VerifiedTarball;
const baseMinorVersionTarball =
  getBaseMinorVersionTarballResult.value as VerifiedTarball;
const baseMajorVersionTarball =
  getBaseMajorVersionTarballResult.value as VerifiedTarball;
const getTarballsEndTime = Bun.nanoseconds();
console.log(
  `Tarballs loaded in ${(getTarballsEndTime - getTarballsStartTime) / 1_000_000_000} seconds`
);

// Getting files
console.log("Getting files...");
const getFilesStartTime = Bun.nanoseconds();
const getTargetVersionFilesResult = await getFiles({
  tarball: targetVersionTarball,
});
if (getTargetVersionFilesResult.isErr()) {
  console.error(getTargetVersionFilesResult.error);
  process.exit(1);
}
const targetVersionFiles = getTargetVersionFilesResult.value;

const getBasePatchVersionFilesResult = await getFiles({
  tarball: basePatchVersionTarball,
});
if (getBasePatchVersionFilesResult.isErr()) {
  console.error(getBasePatchVersionFilesResult.error);
  process.exit(1);
}
const basePatchVersionFiles = getBasePatchVersionFilesResult.value;

const getBaseMinorVersionFilesResult = await getFiles({
  tarball: baseMinorVersionTarball,
});
if (getBaseMinorVersionFilesResult.isErr()) {
  console.error(getBaseMinorVersionFilesResult.error);
  process.exit(1);
}
const baseMinorVersionFiles = getBaseMinorVersionFilesResult.value;

const getBaseMajorVersionFilesResult = await getFiles({
  tarball: baseMajorVersionTarball,
});
if (getBaseMajorVersionFilesResult.isErr()) {
  console.error(getBaseMajorVersionFilesResult.error);
  process.exit(1);
}
const baseMajorVersionFiles = getBaseMajorVersionFilesResult.value;
const getFilesEndTime = Bun.nanoseconds();
console.log(
  `Files loaded in ${(getFilesEndTime - getFilesStartTime) / 1_000_000_000} seconds`
);

// Generating diffs
console.log("Generating diffs...");
const generateDiffStartTime = Bun.nanoseconds();
const targetVSBasePatchDiff = await generateDiff({
  targetVersion,
  baseVersion: basePatchVersion,
  targetFiles: targetVersionFiles,
  baseFiles: basePatchVersionFiles,
});
await Bun.write("target-vs-base-patch-diff.txt", targetVSBasePatchDiff);

const targetVSBaseMinorDiff = await generateDiff({
  targetVersion,
  baseVersion: baseMinorVersion,
  targetFiles: targetVersionFiles,
  baseFiles: baseMinorVersionFiles,
});
await Bun.write("target-vs-base-minor-diff.txt", targetVSBaseMinorDiff);

const targetVSBaseMajorDiff = await generateDiff({
  targetVersion,
  baseVersion: baseMajorVersion,
  targetFiles: targetVersionFiles,
  baseFiles: baseMajorVersionFiles,
});
await Bun.write("target-vs-base-major-diff.txt", targetVSBaseMajorDiff);
const generateDiffEndTime = Bun.nanoseconds();
console.log(
  `Diffs generated in ${(generateDiffEndTime - generateDiffStartTime) / 1_000_000_000} seconds`
);
