import { Encrypter } from '../../data/protocols/cryptography/encrypter';
import { Authenticator } from '../../domain/use-cases/authenticator';

export class Authentication implements Authenticator {
  constructor(
    private readonly encrypter: Encrypter
  ) { }

  async auth(value: string): Promise<string> {
    const accessToken = await this.encrypter.encrypt(value);
    return accessToken;
  }
}
