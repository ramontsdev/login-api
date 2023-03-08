import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: async () => {
    return 'valid_hash';
  }
}));

describe('Bcrypt Adapter', () => {
  test('Deveria chamar o hash com os valores corretos', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(bcrypt.hash).toBeCalledWith('any_value', salt);
  });

  test('Deveria retornar uma hash em caso de sucesso', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    const hash = await sut.hash('any_value');

    expect(hash).toBe('valid_hash');
  });
});
