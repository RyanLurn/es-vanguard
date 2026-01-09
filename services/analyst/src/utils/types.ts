export type ContextErrorObject = {
  name?: string;
  message?: string;
  stack?: string;
  cause?: unknown;
  code?: string;
  expected?: boolean;
  unknown?: boolean;
};
