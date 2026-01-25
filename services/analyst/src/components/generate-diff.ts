import { areFilesIdentical, areContentIdentical } from "#utils/are-identical";
import { isBinaryFile } from "#utils/is-binary";
import {
  isBuildOutputContent,
  isBuildOutputPath,
} from "#utils/is-build-output";
import type { SkippedFile } from "#utils/types/skipped-file";
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
    // OPTIMIZATION 1: Binary Check
    // ---------------------------------------------------------
    const binaryReport = isBinaryFile({ filePath });
    if (binaryReport) {
      // Identical category is prioritized over binary category
      const identicalReport = await areFilesIdentical({
        targetFile,
        baseFile,
        filePath,
      });
      if (identicalReport) {
        skippedStats.push(identicalReport);
        continue;
      }

      skippedStats.push(binaryReport);
      continue;
    }

    // ---------------------------------------------------------
    // OPTIMIZATION 2: Path Check
    // ---------------------------------------------------------
    const buildOutputPathReport = isBuildOutputPath(filePath);
    if (buildOutputPathReport) {
      // Identical category is prioritized over build output path category
      const identicalReport = await areFilesIdentical({
        targetFile,
        baseFile,
        filePath,
      });
      if (identicalReport) {
        skippedStats.push(identicalReport);
        continue;
      }

      skippedStats.push(buildOutputPathReport);
      continue;
    }

    const targetFileName = targetFile ? `b/${filePath}` : "/dev/null";
    const baseFileName = baseFile ? `a/${filePath}` : "/dev/null";

    // ---------------------------------------------------------
    // LOAD CONTENT AS TEXT
    // ---------------------------------------------------------
    const targetFileContent = targetFile
      ? (await targetFile.text()).trim()
      : "";
    const baseFileContent = baseFile ? (await baseFile.text()).trim() : "";

    // ---------------------------------------------------------
    // OPTIMIZATION 3: Identical Text Content Check
    // ---------------------------------------------------------
    const contentIdenticalReport = areContentIdentical({
      targetFileContent,
      baseFileContent,
      filePath,
    });
    if (contentIdenticalReport) {
      skippedStats.push(contentIdenticalReport);
      continue;
    }

    // ---------------------------------------------------------
    // OPTIMIZATION 4: Build Output Content Check
    // ---------------------------------------------------------
    const targetFileBuildOutputContentReport = isBuildOutputContent({
      content: targetFileContent,
      filePath,
    });
    if (targetFileBuildOutputContentReport) {
      skippedStats.push(targetFileBuildOutputContentReport);
      continue;
    }

    const baseFileBuildOutputContentReport = isBuildOutputContent({
      content: baseFileContent,
      filePath,
    });
    if (baseFileBuildOutputContentReport) {
      skippedStats.push(baseFileBuildOutputContentReport);
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
    const identicalFiles = skippedStats.filter(
      (skippedFile) => skippedFile.category === "identical"
    );
    const binFiles = skippedStats.filter(
      (skippedFile) => skippedFile.category === "binary"
    );
    const buildOutputPathFiles = skippedStats.filter(
      (skippedFile) => skippedFile.category === "build_output_path"
    );
    const buildOutputContentFiles = skippedStats.filter(
      (skippedFile) => skippedFile.category === "build_output_content"
    );

    const identicalCount = identicalFiles.length;
    const binCount = binFiles.length;
    const buildOutputPathCount = buildOutputPathFiles.length;
    const buildOutputContentCount = buildOutputContentFiles.length;

    diff += `\n------------------------------------------------------------\n`;
    diff += ` Diff Summary (Files Skipped for Clarity)\n`;
    diff += `------------------------------------------------------------\n`;
    if (identicalCount > 0) {
      diff += `>> Skipped ${identicalCount} identical files\n`;
      diff += identicalFiles
        .map((file) => `  > ${file.path} because of ${file.reason}\n`)
        .join("");
    }
    if (binCount > 0) {
      diff += `>> Skipped ${binCount} binary files\n`;
      diff += binFiles
        .map((file) => `  > ${file.path} because of ${file.reason}\n`)
        .join("");
    }
    if (buildOutputPathCount > 0) {
      diff += `>> Skipped ${buildOutputPathCount} generated files (by file path)\n`;
      diff += buildOutputPathFiles
        .map((file) => `  > ${file.path} because of ${file.reason}\n`)
        .join("");
    }
    if (buildOutputContentCount > 0) {
      diff += `>> Skipped ${buildOutputContentCount} generated files (by content analysis)\n`;
      diff += buildOutputContentFiles
        .map((file) => `  > ${file.path} because of ${file.reason}\n`)
        .join("");
    }
  }

  return diff;
}
