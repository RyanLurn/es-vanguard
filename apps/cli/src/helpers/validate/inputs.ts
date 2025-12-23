import type { Inputs } from "@/helpers/parse-inputs";
import { validateCwdInput } from "@/helpers/validate/cwd";
import { validatePmInput } from "@/helpers/validate/pm";
import { validateBranchInput } from "@/helpers/validate/branch";

async function validateInputs(inputs: Inputs) {
  const gitRepoPathResult = await validateCwdInput({ cwdInput: inputs.cwd });
  if (gitRepoPathResult.isErr()) {
    console.log("Please provide a valid path to a git repository.");
    process.exit(1);
  }

  const gitRepoPath = gitRepoPathResult.value;

  const baseBranchResult = await validateBranchInput({
    gitRepoPath,
    branchInput: inputs.base,
  });
  const headBranchResult = await validateBranchInput({
    gitRepoPath,
    branchInput: inputs.head,
  });
  const pmResult = await validatePmInput({
    cwd: gitRepoPath,
    pmInput: inputs.pmOption,
  });

  if (
    baseBranchResult.isErr() ||
    headBranchResult.isErr() ||
    pmResult.isErr()
  ) {
    console.log("Please provide valid inputs.");
    process.exit(1);
  }

  const base = baseBranchResult.value;
  const head = headBranchResult.value;
  const pm = pmResult.value;

  return { cwd: gitRepoPath, base, head, pm };
}

type ValidatedInputs = Awaited<ReturnType<typeof validateInputs>>;

export { validateInputs };
export type { ValidatedInputs };
