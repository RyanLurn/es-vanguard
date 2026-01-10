import type { PackageMetadata } from "@/utils/get-metadata";
import type { InputValues } from "@/utils/inputs/parse";
import type { ValidInputs } from "@/utils/inputs/validate";
import type { ErrorObject } from "serialize-error";

// --- 1. The Generic Shape ---
export interface LogStep<TName extends string, TData> {
  name: TName;
  time: {
    start: number;
    end: number;
    duration: number;
  };
  success: boolean;
  data?: TData;
  error?: ErrorObject;
}

// --- 2. The Specific Steps ---
export type ParseInputsStep = LogStep<"parse-inputs", InputValues>;
export type ValidateInputsStep = LogStep<"validate-inputs", ValidInputs>;
export type GetMetadataStep = LogStep<"get-metadata", PackageMetadata>;

// --- 3. The Context Accumulator ---

export interface StartContext {
  service: "analyst";
  runId: string;
  time: {
    start: number;
  };
  // Initialize as empty tuple
  steps: [];
}

// Step 1: Parse command line inputs
export interface ParseInputsContext extends Omit<StartContext, "steps"> {
  steps: [ParseInputsStep];
}

// Step 2: Validate parsed inputs
export interface ValidateInputsContext extends Omit<
  ParseInputsContext,
  "steps"
> {
  steps: [...ParseInputsContext["steps"], ValidateInputsStep];
}

// Step 3: Get package metadata from the npm registry
export interface GetMetadataContext extends Omit<
  ValidateInputsContext,
  "steps"
> {
  steps: [...ValidateInputsContext["steps"], GetMetadataStep];
}
