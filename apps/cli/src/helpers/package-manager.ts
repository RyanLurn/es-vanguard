import { detect } from "package-manager-detector/detect";
import { err, ok, Result } from "neverthrow";
import type { Inputs, PackageManager } from "@/lib/types";
import type { DetectOptions } from "package-manager-detector";
import { $ } from "bun";

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

async function checkPackageManager({
  cwd,
  pm,
}: Pick<Inputs, "cwd" | "pm">): Promise<Result<PackageManager, Error>> {
  if (pm === "auto") {
    return detectPackageManager({ cwd });
  }

  try {
    await $`${pm} --version`.cwd(cwd).quiet();
    return ok(pm);
  } catch (error) {
    if (error instanceof $.ShellError) {
      const errorMessage = `Could not find ${pm} in your system.`;
      console.error(errorMessage);
      return err(new Error(errorMessage));
    }

    const errorMessage = `Unexpected error occurred while checking package manager.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

export { detectPackageManager, checkPackageManager };
