import type { ErrorObject } from "serialize-error";

export interface StepContext<TName extends string, TData> {
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

export interface StartContext<TName extends string> {
  service: TName;
  runId: string;
  time: {
    start: number;
  };
  steps: [];
}
