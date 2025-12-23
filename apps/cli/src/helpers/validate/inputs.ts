import type { Inputs } from "@/helpers/parse-inputs";
import { validateCwd } from "@/helpers/validate/cwd";
import { validatePmInput } from "@/helpers/validate/pm";
import { validateGitBranch } from "@/helpers/validate/branch";

async function validateInputs({ cwd, base, head, pmOption }: Inputs) {
  const validateCwdResult = await validateCwd({ cwd });
  const validateBaseResult = await validateGitBranch({ cwd, branchName: base });
  const validateHeadResult = await validateGitBranch({ cwd, branchName: head });
  const validatePmInputResult = await validatePmInput({
    cwd,
    pmInput: pmOption,
  });

  if (
    validateCwdResult.isErr() ||
    validateBaseResult.isErr() ||
    validateHeadResult.isErr() ||
    validatePmInputResult.isErr()
  ) {
    console.error("Please provide valid inputs. Exiting...");
    process.exit(1);
  }

  const validatedInputs = {
    cwd: validateCwdResult.value,
    base: validateBaseResult.value,
    head: validateHeadResult.value,
    pm: validatePmInputResult.value,
  };

  return validatedInputs;
}

export { validateInputs };
