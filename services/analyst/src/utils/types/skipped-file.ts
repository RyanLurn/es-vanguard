import type { binaryExtensions } from "#utils/is-binary";
import type {
  buildOutputContentSkipReasons,
  buildOutputPathSkipReasons,
} from "#utils/is-build-output";

export interface SkippedFile {
  path: string;
  category:
    | "binary"
    | "build_output_path"
    | "build_output_content"
    | "identical";
  reason: string;
}
export interface SkippedIdenticalFile extends SkippedFile {
  category: "identical";
  reason: "identical hashed content" | "identical text content";
}

export type BinaryExtension = (typeof binaryExtensions)[number];

export interface SkippedBinaryFile extends SkippedFile {
  category: "binary";
  reason: BinaryExtension;
}

export type BuildOutputPathReason = (typeof buildOutputPathSkipReasons)[number];

export interface SkippedBuildOutputPathFile extends SkippedFile {
  category: "build_output_path";
  reason: BuildOutputPathReason;
}

export type BuildOutputContentReason =
  (typeof buildOutputContentSkipReasons)[number];

export interface SkippedBuildOutputContentFile extends SkippedFile {
  category: "build_output_content";
  reason: BuildOutputContentReason;
}
