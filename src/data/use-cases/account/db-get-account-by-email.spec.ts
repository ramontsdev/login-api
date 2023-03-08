import { AccountModel } from '../../../domain/models/account-model';
import { GetAccountByEmailRepository } from '../../protocols/db/get-account-by-email-repository';
import { DbGetAccountByEmail } from './db-get-account-by-email';

function makeGetAccountByEmailRepository() {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async getByEmail(email: string): Promise<AccountModel | null> {
      return {
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password'
      };
    }
  }

  return new GetAccountByEmailRepositoryStub();
}

function makeSut() {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepository();
  const sut = new DbGetAccountByEmail(getAccountByEmailRepositoryStub);

  return {
    sut,
    getAccountByEmailRepositoryStub
  };
}

describe('DbGetAccountByEmail', () => {
  test('Deveria chamar GetAccountByEmailRepository com o e-mail correto', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(getAccountByEmailRepositoryStub, 'getByEmail');

    await sut.getByEmail('any_email@mail.com');

    expect(getAccountByEmailRepositoryStub.getByEmail).toBeCalledWith('any_email@mail.com');
  });

  test('Deveria lançar o erro se GetAccountByEmailRepository lançar um erro', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(getAccountByEmailRepositoryStub, 'getByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.getByEmail('any_email@mail.com');

    await expect(promise).rejects.toThrow();
  });

  test('Deveria retornar uma conta em caso de sucesso', async () => {
    const { sut } = makeSut();

    const account = await sut.getByEmail('any_email@mail.com');

    expect(account).toEqual({
      id: 'valid_id',
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password'
    });
  });
});
