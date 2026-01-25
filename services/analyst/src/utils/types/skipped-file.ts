import type { binaryExtensions } from "#utils/is-binary";

export interface SkippedFile {
  path: string;
  category:
    | "binary"
    | "build_output_path"
    | "build_output_content"
    | "identical";
  reason: string;
}

export type BinaryExtension = (typeof binaryExtensions)[number];

export interface SkippedBinaryFile extends SkippedFile {
  category: "binary";
  reason: BinaryExtension;
}

export interface SkippedIdenticalFile extends SkippedFile {
  category: "identical";
  reason: "identical";
}
