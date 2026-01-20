import { findDistObjects } from "#components/find-dist-objects";
import { getPackageMetadata } from "#components/get-package-metadata";
import { getTarball } from "#components/get-tarball";
import { binaryExtensions } from "#utils/is-binary";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import type { Semver } from "@es-vanguard/utils/semver";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const CACHE_DIR = join(import.meta.dir, ".cache");
const PACKAGES = [
  {
    name: "typescript",
    version: "5.9.3",
  },
  {
    name: "@mui/icons-material",
    version: "7.3.7",
  },
  {
    name: "aws-sdk",
    version: "2.1693.0",
  },
  {
    name: "monaco-editor",
    version: "0.55.1",
  },
  {
    name: "caniuse-db",
    version: "1.0.30001765",
  },
  {
    name: "lodash",
    version: "4.17.21",
  },
  {
    name: "next",
    version: "16.1.4",
  },
  {
    name: "rxjs",
    version: "7.8.2",
  },
  {
    name: "prettier",
    version: "3.8.0",
  },
  {
    name: "react-dom",
    version: "19.2.3",
  },
];

const negativeBinaryGlobPatterns = binaryExtensions.map(
  (ext) => `!**/*.${ext}`
);

function getCachePath(pkg: { name: string; version: string }) {
  const hasher = new Bun.CryptoHasher("md5");
  hasher.update(`${pkg.name}@${pkg.version}`);
  const fileName = hasher.digest("hex");
  return join(CACHE_DIR, `${fileName}.tar.gz`);
}

async function prepare() {
  await mkdir(CACHE_DIR, { recursive: true });
  console.log("📦 Preparing tarballs...");

  for (const pkg of PACKAGES) {
    const cachePath = getCachePath(pkg);
    if (await Bun.file(cachePath).exists()) {
      continue;
    }

    console.log(`   Downloading ${pkg.name}@${pkg.version}...`);
    // Get package metadata
    const getPackageMetadataResult = await getPackageMetadata({
      packageName: pkg.name as NpmPackageName,
    });
    if (getPackageMetadataResult.isErr()) {
      console.error(`Failed to get metadata for ${pkg.name}@${pkg.version}`);
      console.error(getPackageMetadataResult.error);
      console.error("Exiting...");
      process.exit(1);
    }
    const metadata = getPackageMetadataResult.value;
    // Find tarball url to download
    const findDistObjectsResult = findDistObjects({
      name: pkg.name as NpmPackageName,
      target: pkg.version as Semver,
      base: "previous",
      packageMetadata: metadata,
    });
    if (findDistObjectsResult.isErr()) {
      console.error(
        `Failed to find dist objects for ${pkg.name}@${pkg.version}`
      );
      console.error(findDistObjectsResult.error);
      console.error("Exiting...");
      process.exit(1);
    }
    const tarballURL = findDistObjectsResult.value.targetDist.tarball;
    // Download tarball
    const getTarballResult = await getTarball({
      tarballURL,
    });
    if (getTarballResult.isErr()) {
      console.error(
        `Failed to download tarball for ${pkg.name}@${pkg.version}`
      );
      console.error(getTarballResult.error);
      console.error("Exiting...");
      process.exit(1);
    }
    const tarball = getTarballResult.value;
    await Bun.write(cachePath, tarball);
    console.log(`   Downloaded ${pkg.name}@${pkg.version}`);
  }
  console.log("✅ Ready.\n");
}

async function runBenchmark() {
  await prepare();

  console.log(
    `| ${"Package".padEnd(20)} | Files | Size (MB) | Time (ms) | Memory Delta (MB) |`
  );
  console.log(
    `| ${"-".repeat(20)} | ${"-".repeat(5)} | ${"-".repeat(9)} | ${"-".repeat(9)} | ${"-".repeat(17)} |`
  );

  for (const pkg of PACKAGES) {
    const tarballPath = getCachePath(pkg);
    const tarballFile = Bun.file(tarballPath);
    const tarballBuffer = await tarballFile.arrayBuffer();
    const rawSizeMB = (tarballBuffer.byteLength / 1024 / 1024).toFixed(2);

    Bun.gc(true);
    const startMem = process.memoryUsage().rss;
    const start = performance.now();

    // The core logic of untar function
    const archive = new Bun.Archive(tarballBuffer);
    const archiveFiles = await archive.files([
      "**/*",
      ...negativeBinaryGlobPatterns,
    ]);
    // const extractedFiles = new Map<string, Uint8Array>();
    // for (const [rawPath, file] of archiveFiles) {
    //   const cleanPath = rawPath.replace(/^[^/]+\//, "");
    //   extractedFiles.set(`${pkg.name}/${cleanPath}`, await file.bytes());
    // }

    const end = performance.now();
    const endMem = process.memoryUsage().rss;

    const memDelta = (endMem - startMem) / 1024 / 1024; // MB
    const fileCount = archiveFiles.size;

    console.log(
      `| ${pkg.name.padEnd(20)} ` +
        `| ${fileCount.toString().padEnd(5)} ` +
        `| ${rawSizeMB.padEnd(9)} ` +
        `| ${(end - start).toFixed(2).padEnd(9)} ` +
        `| ${memDelta.toFixed(2).padEnd(17)} |`
    );

    Bun.gc(true);
  }
}

console.log("Start benchmarking with binary filters...");
for (let i = 0; i < 10; i++) {
  console.log(`\nRun ${i + 1}/10`);
  await runBenchmark();
  Bun.gc(true);
}
console.log("Done.");
