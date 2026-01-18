import type { DistObject } from "#components/get-package-metadata";
import { SUPPORTED_CRYPTO_ALGORITHMS } from "#utils/constants";
import type { Branded } from "#utils/types/brand";
import type { SupportedCryptoAlgorithms } from "bun";
import { err, ok, Result } from "neverthrow";

export type VerifiedTarball = Branded<Blob, "verified-tarball">;

export function verifyTarball({
  tarball,
  distObject,
}: {
  tarball: Blob;
  distObject: DistObject;
}): Result<VerifiedTarball, string> {
  if (distObject.integrity) {
    const integrity = distObject.integrity;
    const hashes = integrity.split(" ");
    const supportedHash = hashes.find((hash) =>
      SUPPORTED_CRYPTO_ALGORITHMS.includes(
        hash.split("-")[0] as SupportedCryptoAlgorithms
      )
    );

    if (supportedHash) {
      const [algo, expectedHashValue] = supportedHash.split("-");
      if (algo && expectedHashValue) {
        const hasher = new Bun.CryptoHasher(algo as SupportedCryptoAlgorithms);
        hasher.update(tarball, "base64");
        const actualHashValue = hasher.digest("base64");

        if (actualHashValue !== expectedHashValue) {
          return err("Integrity check failed");
        }

        return ok(tarball as VerifiedTarball);
      }
    }
  }

  if (distObject.shasum) {
    const expectedShasum = distObject.shasum;
    const hasher = new Bun.CryptoHasher("sha1");
    hasher.update(tarball, "hex");
    const actualShasum = hasher.digest("hex");

    if (actualShasum !== expectedShasum) {
      return err("Shasum check failed");
    }

    return ok(tarball as VerifiedTarball);
  }

  return err("No integrity or shasum provided");
}
