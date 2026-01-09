export class UnexpectedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UnexpectedError";
  }
}

export class ExoticError extends UnexpectedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExoticError";
  }
}
