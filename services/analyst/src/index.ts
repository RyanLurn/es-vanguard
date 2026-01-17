import { parseInputs } from "#utils/inputs/parse";
import { validateInputs } from "#utils/inputs/validate";

const parseInputsResult = await parseInputs();
if (parseInputsResult.isErr()) {
  console.error(parseInputsResult.error);
  process.exit(1);
}
const inputs = parseInputsResult.value;

const validateInputsResult = validateInputs({ inputs });
if (validateInputsResult.isErr()) {
  console.error(validateInputsResult.error);
  process.exit(1);
}
const validatedInputs = validateInputsResult.value;
