import { InputsSchema } from "#components/parse-inputs";
import { semver } from "bun";

const name = "react";
const target = "          19.2.3";
const base = "previous      ";

const parseResult = InputsSchema.safeParse({
  name,
  target,
  base,
});

console.log(parseResult);
