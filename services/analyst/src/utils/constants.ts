import type { SupportedCryptoAlgorithms } from "bun";

export const DEFAULT_BASE_VERSION = "previous";
export const SUPPORTED_CRYPTO_ALGORITHMS: SupportedCryptoAlgorithms[] = [
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
