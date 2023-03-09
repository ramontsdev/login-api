import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: async () => {
    return 'valid_hash';
  },

  compare: async () => {
    return true;
  }
}));

const salt = 12;

function makeSut() {
  const sut = new BcryptAdapter(salt);
  return sut;
}

describe('Bcrypt Adapter', () => {
  describe('Hash', () => {
    test('Deveria chamar o hash com os valores corretos', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash');

      await sut.hash('any_value');

      expect(bcrypt.hash).toBeCalledWith('any_value', salt);
    });

    test('Deveria retornar uma hash em caso de sucesso', async () => {
      const sut = makeSut();

      const hash = await sut.hash('any_value');

      expect(hash).toBe('valid_hash');
    });
  });


  describe('HashComparer', () => {
    test('Deveria chamar o comparer com os valores corretos', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare');

      await sut.compare('any_value', 'hashed_password');

      expect(bcrypt.compare).toBeCalledWith('any_value', 'hashed_password');
    });

    test('Deveria retornar false se o bcrypt.compare retornar false', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare')
        .mockImplementationOnce(
          () => new Promise(resolve => resolve(false))
        );

      const isValid = await sut.compare('any_value', 'hashed_password');

      expect(isValid).toBe(false);
    });

    test('Deveria retornar true em caso de sucesso', async () => {
      const sut = makeSut();

      const isValid = await sut.compare('any_value', 'hashed_password');

      expect(isValid).toBe(true);
    });
  });
});
