import type { StandardSchemaV1 } from "@standard-schema/spec";
import { SchemaError } from "@standard-schema/utils";
import { err, ok, type Result } from "neverthrow";

async function safeJsonParse<T extends StandardSchemaV1>({
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
    const jsonParseResult = JSON.parse(text);

    let validationResult = schema["~standard"].validate(jsonParseResult);

    if (validationResult instanceof Promise) {
      validationResult = await validationResult;
    }

    if (validationResult.issues) {
      if (enableLogging) {
        console.error(JSON.stringify(validationResult.issues, null, 2));
      }
      return err(new SchemaError(validationResult.issues));
    }

    return ok(validationResult.value);
  } catch (error) {
    if (error instanceof SyntaxError) {
      if (enableLogging) {
        console.error("Syntax error:", error);
      }
      return err(error);
    }

    if (enableLogging) {
      console.error("Unknown error:", error);
    }
    return err(new Error("Unknown error"));
  }
}

export { safeJsonParse };
