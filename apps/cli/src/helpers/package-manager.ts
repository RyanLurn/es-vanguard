import { detect } from "package-manager-detector/detect";
import { err, ok, Result } from "neverthrow";
import type { Inputs, PackageManager } from "@/lib/types";
import type { DetectOptions } from "package-manager-detector";

async function detectPackageManager(
  options: DetectOptions
): Promise<Result<PackageManager, Error>> {
  try {
    const detectResult = await detect(options);
    if (!detectResult) {
      return err(new Error("Could not detect package manager."));
    }
    return ok(detectResult.name);
  } catch (error) {
    const errorMessage =
      "Unexpected error occurred while detecting package manager.";
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

export { detectPackageManager };
