import type { SkippedIdenticalFile } from "#utils/types/skipped-file";

export async function areFilesIdentical({
  targetFile,
  baseFile,
  filePath,
}: {
  targetFile: File | undefined;
  baseFile: File | undefined;
  filePath: string;
}): Promise<SkippedIdenticalFile | undefined> {
  try {
    if (targetFile && baseFile) {
      const targetFileHash = Bun.hash.xxHash3(await targetFile.arrayBuffer());
      const baseFileHash = Bun.hash.xxHash3(await baseFile.arrayBuffer());
      if (targetFileHash === baseFileHash) {
        const report: SkippedIdenticalFile = {
          path: filePath,
          category: "identical",
          reason: "identical hashed content",
        };
        return report;
      }
    }

    return undefined;
  } catch (error) {
    console.warn(`Failed to check if files are identical: ${error}`);
    return undefined;
  }
}

export function areContentIdentical({
  targetFileContent,
  baseFileContent,
  filePath,
}: {
  targetFileContent: string;
  baseFileContent: string;
  filePath: string;
}): SkippedIdenticalFile | undefined {
  if (targetFileContent === baseFileContent) {
    const report: SkippedIdenticalFile = {
      path: filePath,
      category: "identical",
      reason: "identical text content",
    };
    return report;
  }

  return undefined;
}
