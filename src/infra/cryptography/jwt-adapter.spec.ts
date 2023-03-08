import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: () => {
    return 'access_token';
  }
}));

describe('Jwt Adapter', () => {
  test('Deveria chamar sign com os valores corretos', async () => {
    const sut = new JwtAdapter('secret');

    jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_value');

    expect(jwt.sign).toBeCalledWith('any_value', 'secret');
  });

  test('Deveria lançar erro se o sign lançar um erro', async () => {
    const sut = new JwtAdapter('secret');

    jest.spyOn(jwt, 'sign')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    const promise = sut.encrypt('any_value');

    await expect(promise).rejects.toThrow();
  });

  test('Deveria retornar um access_token em caso de sucesso', async () => {
    const sut = new JwtAdapter('secret');

    const accessToken = await sut.encrypt('any_value');

    expect(accessToken).toBe('access_token');
  });
});
