export class NotFoundError extends Error {
  constructor(paramName: string) {
    super(`Resource not found: ${paramName}`);
    this.name = 'NotFoundError';
  }
}
