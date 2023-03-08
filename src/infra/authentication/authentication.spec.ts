import { Encrypter } from '../../data/protocols/cryptography/encrypter';
import { Authentication } from './authentication';

function makeEncrypter() {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return 'access_token';
    }
  }

  return new EncrypterStub();
}

function makeSut() {
  const encrypterStub = makeEncrypter();
  const sut = new Authentication(encrypterStub);
  return {
    sut,
    encrypterStub
  };
}

describe('Authentication', () => {
  test('Deveria chamar Encrypter com o valor correto', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt');

    await sut.auth('any_id');

    expect(encrypterStub.encrypt).toBeCalledWith('any_id');
  });

  test('Deveria lançar erro se o Encrypter lançar um erro', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth('any_id');

    expect(promise).rejects.toThrow();
  });

  test('Deveria retornar um accessToken em caso de sucesso', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth('any_id');

    expect(accessToken).toBe('access_token');
  });
});
