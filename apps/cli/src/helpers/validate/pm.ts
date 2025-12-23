import { detect } from "package-manager-detector/detect";
import { err, ok, Result } from "neverthrow";
import type { DetectOptions } from "package-manager-detector";
import { $ } from "bun";
import * as z from "zod";
import { SUPPORTED_PMS } from "@/lib/constants";

const PmSchema = z.enum(SUPPORTED_PMS);
const PmInputSchema = z.enum([...SUPPORTED_PMS, "auto"]);

type Pm = z.infer<typeof PmSchema>;
type PmInput = z.infer<typeof PmInputSchema>;

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
  pmInput,
}: {
  cwd: string;
  pmInput: PmInput;
}): Promise<Result<Pm, Error>> {
  if (pmInput === "auto") {
    return detectPm({ cwd });
  }

  try {
    await $`${pmInput} --version`.cwd(cwd).quiet();
    return ok(pmInput);
  } catch (error) {
    if (error instanceof $.ShellError) {
      const errorMessage = `Could not find ${pmInput} in your system.`;
      console.error(errorMessage);
      return err(new Error(errorMessage));
    }

    const errorMessage = `Unexpected error occurred while checking for ${pmInput} in your system.`;
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
}): Promise<Result<PmInput, Error>> {
  const parseResult = PmInputSchema.safeParse(pmInput);
  if (!parseResult.success) {
    const errorMessage = `Invalid package manager option: ${pmInput}`;
    console.error(errorMessage);
    return err(new Error(errorMessage));
  }

  const validatedPmInput = parseResult.data;

  const checkPmResult = await checkPm({ cwd, pmInput: validatedPmInput });
  if (checkPmResult.isErr()) {
    return checkPmResult;
  }

  return ok(validatedPmInput);
}

export { detectPm, checkPm, validatePmInput, PmInputSchema, PmSchema };
export type { PmInput, Pm };
