import { AccountModel } from '../../../domain/models/account-model';
import { CreateAccountModel } from '../../../domain/models/create-account-model';
import { CreateAccountRepository } from '../../protocols/create-account-repository';
import { DbCreateAccount } from './db-create-account';

function makeCreateAccountRepository() {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(accountData: CreateAccountModel): Promise<AccountModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      };
    }
  }
  return new CreateAccountRepositoryStub();
}

function makeSut() {
  const createAccountRepositoryStub = makeCreateAccountRepository();
  const sut = new DbCreateAccount(createAccountRepositoryStub);

  return {
    sut,
    createAccountRepositoryStub
  };
}

describe('DbCreateAccount use case', () => {
  test('Deveria chamar o CreateAccountRepository com os valores corretos', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest.spyOn(createAccountRepositoryStub, 'create');

    await sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });

    expect(createAccountRepositoryStub.create).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Deveria lançar erro se o CreateAccountRepository lançar um erro', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest.spyOn(createAccountRepositoryStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });

    await expect(promise).rejects.toThrow();
  });
});
