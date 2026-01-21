import { isBinary } from "#utils/is-binary";
import {
  isBuildOutputContent,
  isBuildOutputPath,
} from "#utils/is-build-output";
import type { Semver } from "@es-vanguard/utils/semver";
import { createTwoFilesPatch } from "diff";

type SkippedFile = {
  path: string;
  reason: "binary" | "build_output_path" | "build_output_content";
};

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
    // OPTIMIZATION 1: Path Check (Fail Fast, No I/O, No Memory)
    // ---------------------------------------------------------
    if (isBuildOutputPath(filePath)) {
      skippedStats.push({ path: filePath, reason: "build_output_path" });
      continue;
    }

    // ---------------------------------------------------------
    // OPTIMIZATION 2: Binary Check (Fail Fast)
    // ---------------------------------------------------------
    if (isBinary({ filePath })) {
      skippedStats.push({ path: filePath, reason: "binary" });
      continue;
    }

    const targetFileName = targetFile ? `b/${filePath}` : "/dev/null";
    const baseFileName = baseFile ? `a/${filePath}` : "/dev/null";

    // ---------------------------------------------------------
    // LOAD CONTENT (The Memory Cost)
    // ---------------------------------------------------------
    const targetFileContent = targetFile ? await targetFile.text() : "";
    const baseFileContent = baseFile ? await baseFile.text() : "";

    // ---------------------------------------------------------
    // OPTIMIZATION 3: Content Check (Fail Slow)
    // ---------------------------------------------------------
    if (
      isBuildOutputContent(targetFileContent) ||
      isBuildOutputContent(baseFileContent)
    ) {
      skippedStats.push({ path: filePath, reason: "build_output_content" });
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
    const binCount = skippedStats.filter(
      (skippedFile) => skippedFile.reason === "binary"
    ).length;
    const buildOutputPathCount = skippedStats.filter(
      (skippedFile) => skippedFile.reason === "build_output_path"
    ).length;
    const buildOutputContentCount = skippedStats.filter(
      (skippedFile) => skippedFile.reason === "build_output_content"
    ).length;

    diff += `\n------------------------------------------------------------\n`;
    diff += ` Diff Summary (Files Skipped for Clarity)\n`;
    diff += `------------------------------------------------------------\n`;
    if (buildOutputPathCount > 0) {
      diff += `> Skipped ${buildOutputPathCount} build artifacts (by filename)\n`;
    }
    if (buildOutputContentCount > 0) {
      diff += `> Skipped ${buildOutputContentCount} generated files (by content analysis)\n`;
    }
    if (binCount > 0) {
      diff += `> Skipped ${binCount} binary files\n`;
    }
  }

  return diff;
}
