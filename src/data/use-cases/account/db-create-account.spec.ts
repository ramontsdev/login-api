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
  test('Deveria chamar o CreateAccountRepository com os valores corretos', () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest.spyOn(createAccountRepositoryStub, 'create');

    sut.create({
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
});
