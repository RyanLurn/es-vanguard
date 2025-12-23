import { parseInputs } from "@/helpers/parse-inputs";
import { validateInputs } from "@/helpers/validate/inputs";

const inputs = await parseInputs({});
const validatedInputs = await validateInputs(inputs);

console.log(validatedInputs);
