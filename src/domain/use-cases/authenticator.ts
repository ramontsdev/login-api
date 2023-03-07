export interface Authenticator {
  auth(value: any): Promise<string>;
}
