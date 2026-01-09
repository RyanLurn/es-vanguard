export type Context = {
  service: "analyst";
  runId: string;
  time: {
    start: number;
    end: number | undefined;
    duration: number | undefined;
  };
  steps: Array<Record<string, any>>;
};

export type ContextErrorObject = {
  name?: string;
  message?: string;
  stack?: string;
  cause?: unknown;
  code?: string;
  expected?: boolean;
  unknown?: boolean;
};
