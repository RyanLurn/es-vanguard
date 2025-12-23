import { detect } from "package-manager-detector/detect";
import { err, ok, Result } from "neverthrow";
import type { DetectOptions } from "package-manager-detector";
import { $ } from "bun";
import * as z from "zod";
import { SUPPORTED_PMS } from "@/lib/constants";

const PmSchema = z.enum(SUPPORTED_PMS);
const PmOptionSchema = z.enum([...SUPPORTED_PMS, "auto"]);

type Pm = z.infer<typeof PmSchema>;
type PmOption = z.infer<typeof PmOptionSchema>;

async function detectPm(options: DetectOptions): Promise<Result<Pm, Error>> {
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

async function checkPm({
  cwd,
  pmOption,
}: {
  cwd: string;
  pmOption: PmOption;
}): Promise<Result<Pm, Error>> {
  if (pmOption === "auto") {
    return detectPm({ cwd });
  }

  try {
    await $`${pmOption} --version`.cwd(cwd).quiet();
    return ok(pmOption);
  } catch (error) {
    if (error instanceof $.ShellError) {
      const errorMessage = `Could not find ${pmOption} in your system.`;
      console.error(errorMessage);
      return err(new Error(errorMessage));
    }

    const errorMessage = `Unexpected error occurred while checking for ${pmOption} in your system.`;
    console.error(errorMessage);
    console.error(error);
    return err(new Error(errorMessage));
  }
}

async function validatePmInput({
  cwd,
  pmInput,
}: {
  cwd: string;
  pmInput: string;
}): Promise<Result<Pm, Error>> {
  const parseResult = PmOptionSchema.safeParse(pmInput);
  if (!parseResult.success) {
    const errorMessage = `Invalid package manager option: ${pmInput}`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  }

  const validatedPmInput = parseResult.data;

  const checkPmResult = await checkPm({ cwd, pmOption: validatedPmInput });
  if (checkPmResult.isErr()) {
    return checkPmResult;
  }

  const pm = checkPmResult.value;

  return ok(pm);
}

export { detectPm, checkPm, validatePmInput, PmOptionSchema, PmSchema };
export type { PmOption };
