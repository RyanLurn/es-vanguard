import { YAML } from "bun";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { SchemaError } from "@standard-schema/utils";
import { err, ok, type Result } from "neverthrow";

async function safeYamlParse<T extends StandardSchemaV1>({
  text,
  schema,
  enableLogging = false,
}: {
  text: string;
  schema: T;
  enableLogging?: boolean;
}): Promise<
  Result<StandardSchemaV1.InferOutput<T>, SyntaxError | SchemaError | Error>
> {
  try {
    // 1. Native Bun YAML Parse
    // Bun.YAML.parse throws a SyntaxError if the YAML is invalid
    const yamlParseResult = YAML.parse(text);

    // 2. Validate against Standard Schema
    let validationResult = schema["~standard"].validate(yamlParseResult);

    // 3. Handle Async Validation (if schema requires it)
    if (validationResult instanceof Promise) {
      validationResult = await validationResult;
    }

    // 4. Check for Validation Issues
    if (validationResult.issues) {
      if (enableLogging) {
        console.error(JSON.stringify(validationResult.issues, null, 2));
      }
      return err(new SchemaError(validationResult.issues));
    }

    // 5. Success
    return ok(validationResult.value);
  } catch (error) {
    // 6. Handle Parsing Errors
    if (error instanceof SyntaxError) {
      if (enableLogging) {
        console.error("YAML Syntax error:", error);
      }
      return err(error);
    }

    if (enableLogging) {
      console.error("Unknown error:", error);
    }

    const e = error instanceof Error ? error : new Error(String(error));
    return err(e);
  }
}

export { safeYamlParse };
