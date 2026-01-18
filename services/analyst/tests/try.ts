import { findDistObjects } from "#components/find-dist-objects";
import { getPackageMetadata } from "#components/get-package-metadata";
import { betterFetch } from "@better-fetch/fetch";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import type { SupportedCryptoAlgorithms } from "bun";

const packageName = "vue" as NpmPackageName;
const target = "3.5.26" as Semver;
const base = "previous";

const getVueMetadataResult = await getPackageMetadata({
  packageName,
});

if (getVueMetadataResult.isErr()) {
  console.error(getVueMetadataResult.error);
  process.exit(1);
}

const vueMetadata = getVueMetadataResult.value;

const findDistResult = findDistObjects({
  name: packageName,
  target,
  base,
  packageMetadata: vueMetadata,
});

if (findDistResult.isErr()) {
  console.error(findDistResult.error);
  process.exit(1);
}

const { targetDist, baseDist } = findDistResult.value;

const { data: targetTarballData, error: targetTarballError } =
  await betterFetch<Blob>(targetDist.tarball);

if (targetTarballError) {
  console.error(targetTarballError);
  process.exit(1);
}

if (targetDist.integrity) {
  const targetIntegrity = targetDist.integrity;
  const hashes = targetIntegrity.split(" ");
  const supportedAlgos: SupportedCryptoAlgorithms[] = [
    "blake2b256",
    "blake2b512",
    "blake2s256",
    "md4",
    "md5",
    "ripemd160",
    "sha1",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "sha512-224",
    "sha512-256",
    "sha3-224",
    "sha3-256",
    "sha3-384",
    "sha3-512",
    "shake128",
    "shake256",
  ];
  const selectedHash = hashes.find((hash) =>
    supportedAlgos.includes(hash.split("-")[0] as SupportedCryptoAlgorithms)
  );

  if (!selectedHash) {
    console.error("No supported hash found");
    process.exit(1);
  }

  const [algo, expectedHash] = selectedHash.split("-");
  if (!algo || !expectedHash) {
    console.error("Invalid hash format");
    process.exit(1);
  }

  const hasher = new Bun.CryptoHasher(algo as SupportedCryptoAlgorithms);
  hasher.update(targetTarballData, "base64");
  const actualHash = hasher.digest("base64");

  if (actualHash !== expectedHash) {
    console.error(
      `Integrity check failed.\nExpected: ${expectedHash}\nActual: ${actualHash}`
    );
    process.exit(1);
  }

  const targetArchive = new Bun.Archive(targetTarballData);
  const targerFiles = await targetArchive.files("package/**/*");

  const packageJson = targerFiles.get("package/package.json");

  if (packageJson) {
    const pkg = JSON.parse(await packageJson.text());
    console.log(`Package: ${pkg.name}@${pkg.version}`);
  }
} else {
  console.log("No integrity");
  process.exit(1);
}
