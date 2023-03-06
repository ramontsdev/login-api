import { AccountModel } from '../../../domain/models/account-model';
import { CreateAccountModel } from '../../../domain/models/create-account-model';
import { Hasher } from '../../protocols/cryptography/hasher';
import { CreateAccountRepository } from '../../protocols/db/create-account-repository';
import { DbCreateAccount } from './db-create-account';

function makeHasher() {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return 'hashed_password';
    }
  }

  return new HasherStub();
}

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
  const hasherStub = makeHasher();
  const sut = new DbCreateAccount(createAccountRepositoryStub, hasherStub);

  return {
    sut,
    createAccountRepositoryStub,
    hasherStub
  };
}

describe('DbCreateAccount use case', () => {
  test('Deveria chamar o Hasher.hash com o valor correto', () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash');

    sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });

    expect(hasherStub.hash).toBeCalledWith('any_email@mail.com');
  });

  test('Deveria lançar erro se Hasher.hash lançar um erro', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash')
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
      password: 'hashed_password'
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

  test('Deveria retornar uma conta em caso de sucesso', async () => {
    const { sut } = makeSut();

    const account = await sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });

    expect(account).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });
});
