import type { ErrorObject } from "serialize-error";

// --- The Generic Shape ---
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

// --- The Context Accumulator ---
export interface StartContext {
  service: "analyst";
  runId: string;
  time: {
    start: number;
  };
  // Initialize as empty tuple
  steps: [];
}
