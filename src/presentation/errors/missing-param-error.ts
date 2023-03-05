export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing param error: ${paramName}`);
    this.name = 'MissingParamError';
  }
}
