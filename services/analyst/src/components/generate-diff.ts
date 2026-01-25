import { areDifferent } from "#utils/are-different";
import { isBinaryFile } from "#utils/is-binary";
import {
  isBuildOutputContent,
  isBuildOutputPath,
} from "#utils/is-build-output";
import type {
  SkippedFile,
  SkippedIdenticalFile,
} from "#utils/types/skipped-file";
import type { Semver } from "@es-vanguard/utils/semver";
import { createTwoFilesPatch } from "diff";

export async function generateDiff({
  targetVersion,
  baseVersion,
  targetFiles,
  baseFiles,
}: {
  targetVersion: Semver;
  baseVersion: Semver;
  targetFiles: Map<string, File>;
  baseFiles: Map<string, File>;
}) {
  let diff = "";
  const skippedStats: SkippedFile[] = [];

  const files = new Set<string>([...targetFiles.keys(), ...baseFiles.keys()]);

  for (const filePath of files.values()) {
    const targetFile = targetFiles.get(filePath);
    const baseFile = baseFiles.get(filePath);

    // ---------------------------------------------------------
    // OPTIMIZATION 1: Identical Check
    // ---------------------------------------------------------
    const hasChanges = areDifferent({ targetFile, baseFile });
    if (!hasChanges) {
      const skippedIdenticalFile: SkippedIdenticalFile = {
        path: filePath,
        category: "identical",
        reason: "identical",
      };
      skippedStats.push(skippedIdenticalFile);
      continue;
    }

    // ---------------------------------------------------------
    // OPTIMIZATION 2: Binary Check
    // ---------------------------------------------------------
    const skippedBinaryFile = isBinaryFile({ filePath });
    if (skippedBinaryFile) {
      skippedStats.push(skippedBinaryFile);
      continue;
    }

    // ---------------------------------------------------------
    // OPTIMIZATION 3: Path Check (Fail Fast)
    // ---------------------------------------------------------
    const skippedBuildOutputPathFile = isBuildOutputPath(filePath);
    if (skippedBuildOutputPathFile) {
      skippedStats.push(skippedBuildOutputPathFile);
      continue;
    }

    const targetFileName = targetFile ? `b/${filePath}` : "/dev/null";
    const baseFileName = baseFile ? `a/${filePath}` : "/dev/null";

    // ---------------------------------------------------------
    // LOAD CONTENT (The Memory Cost)
    // ---------------------------------------------------------
    const targetFileContent = targetFile
      ? (await targetFile.text()).trim()
      : "";
    const baseFileContent = baseFile ? (await baseFile.text()).trim() : "";

    // ---------------------------------------------------------
    // OPTIMIZATION 4: Content Check (Fail Slow)
    // ---------------------------------------------------------
    if (
      isBuildOutputContent(targetFileContent).reason !== "none" ||
      isBuildOutputContent(baseFileContent).reason !== "none"
    ) {
      console.log(
        `Skipping ${filePath} because it is a build output file (by content analysis)`
      );
      console.log(`Reason: ${isBuildOutputContent(targetFileContent).reason}`);
      console.log(`Reason: ${isBuildOutputContent(baseFileContent).reason}`);
      skippedStats.push({
        path: filePath,
        category: "build_output_content",
        reason: "build_output_content",
      });
      continue;
    }

    // Identical check
    if (baseFileContent === targetFileContent) {
      continue;
    }

    // ---------------------------------------------------------
    // GENERATE DIFF
    // ---------------------------------------------------------
    diff += `diff --git a/${filePath} b/${filePath}\n`;
    let fileMode = "100644";
    if (!baseFile) {
      fileMode = "";
      diff += "new file mode 100644\n";
    }
    if (!targetFile) {
      fileMode = "";
      diff += "deleted file mode 100644\n";
    }
    diff += `index v${baseVersion}..v${targetVersion} ${fileMode}\n`;

    const fileDiff = createTwoFilesPatch(
      baseFileName,
      targetFileName,
      baseFileContent,
      targetFileContent,
      undefined,
      undefined,
      {
        headerOptions: {
          includeIndex: true,
          includeUnderline: false,
          includeFileHeaders: true,
        },
      }
    );
    diff += fileDiff;
  }

  // ---------------------------------------------------------
  // APPEND SUMMARY
  // ---------------------------------------------------------
  if (skippedStats.length > 0) {
    const binFiles = skippedStats.filter(
      (skippedFile) => skippedFile.reason === "binary"
    );
    const buildOutputPathFiles = skippedStats.filter(
      (skippedFile) => skippedFile.reason === "build_output_path"
    );
    const buildOutputContentFiles = skippedStats.filter(
      (skippedFile) => skippedFile.reason === "build_output_content"
    );

    const binCount = binFiles.length;
    const buildOutputPathCount = buildOutputPathFiles.length;
    const buildOutputContentCount = buildOutputContentFiles.length;

    diff += `\n------------------------------------------------------------\n`;
    diff += ` Diff Summary (Files Skipped for Clarity)\n`;
    diff += `------------------------------------------------------------\n`;
    if (binCount > 0) {
      diff += `>> Skipped ${binCount} binary files\n`;
      diff += binFiles.map((file) => `  > ${file.path}\n`).join("");
    }
    if (buildOutputPathCount > 0) {
      diff += `>> Skipped ${buildOutputPathCount} generated files (by file path)\n`;
      diff += buildOutputPathFiles.map((file) => `  > ${file.path}\n`).join("");
    }
    if (buildOutputContentCount > 0) {
      diff += `>> Skipped ${buildOutputContentCount} generated files (by content analysis)\n`;
      diff += buildOutputContentFiles
        .map((file) => `  > ${file.path}\n`)
        .join("");
    }
  }

  return diff;
}
