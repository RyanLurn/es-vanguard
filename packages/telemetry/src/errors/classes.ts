interface CustomErrorOptions extends ErrorOptions {
  code: string;
  expected: boolean;
  context?: Record<string, unknown>;
}

export class CustomError extends Error {
  code: string;
  expected: boolean;
  context?: Record<string, unknown>;

  constructor(message: string, options: CustomErrorOptions) {
    super(message, options);
    this.name = "CustomError";
    this.code = options.code;
    this.expected = options.expected;
    this.context = options.context;
  }
}
