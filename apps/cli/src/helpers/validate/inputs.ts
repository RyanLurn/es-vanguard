import type { Inputs } from "@/helpers/parse-inputs";
import { validateCwdInput } from "@/helpers/validate/cwd";
import { validatePmInput } from "@/helpers/validate/pm";
import { validateBranchInputs } from "@/helpers/validate/branch";

async function validateInputs(inputs: Inputs) {
  const gitRepoPathResult = await validateCwdInput({ cwdInput: inputs.cwd });
  if (gitRepoPathResult.isErr()) {
    console.log("Please provide a valid path to a git repository.");
    process.exit(1);
  }
  const gitRepoPath = gitRepoPathResult.value;

  const validateBranchInputsResult = await validateBranchInputs({
    gitRepoPath,
    baseInput: inputs.base,
    headInput: inputs.head,
  });

  const pmResult = await validatePmInput({
    cwd: gitRepoPath,
    pmInput: inputs.pm,
  });

  if (validateBranchInputsResult.isErr() || pmResult.isErr()) {
    console.log("Please provide valid inputs.");
    process.exit(1);
  }

  const base = validateBranchInputsResult.value.base;
  const head = validateBranchInputsResult.value.head;
  const pm = pmResult.value;

  return { cwd: gitRepoPath, base, head, pm };
}

type ValidatedInputs = Awaited<ReturnType<typeof validateInputs>>;

export { validateInputs };
export type { ValidatedInputs };
