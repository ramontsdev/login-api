import { HashComparer } from '../../../../data/protocols/cryptography/hash-comparer';
import { AccountModel } from '../../../../domain/models/account-model';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { MissingParamError } from '../../../errors/missing-param-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { badRequest, notFound } from '../../../helpers/http-helpers';
import { SignInController } from './sign-in-controller';

const fakeAccount = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
};

function makeGetAccountByEmail() {
  class GetAccountByEmailStub implements GetAccountByEmail {
    async getByEmail(email: string): Promise<AccountModel | null> {
      return fakeAccount;
    }
  }
  return new GetAccountByEmailStub();
}

function makeHashComparer() {
  class HashComparerStub implements HashComparer {
    async comparer(value: string, hash: string) {
      return true;
    }
  }

  return new HashComparerStub();
}

function makeSut() {
  const getAccountByEmailStub = makeGetAccountByEmail();
  const hashComparerStub = makeHashComparer();
  const sut = new SignInController(getAccountByEmailStub, hashComparerStub);
  return {
    sut,
    getAccountByEmailStub,
    hashComparerStub
  };
}

describe('SignIn Controller', () => {
  test('Deveria retornar badRequest caso e-mail não for passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Deveria retornar badRequest caso password não for passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Deveria chamar GetAccountByEmail com o e-mail correto', async () => {
    const { sut, getAccountByEmailStub } = makeSut();
    jest.spyOn(getAccountByEmailStub, 'getByEmail');

    await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    });

    expect(getAccountByEmailStub.getByEmail).toBeCalledWith('any_email@mail.com');
  });

  test('Deveria retornar 404 se o GetAccountByEmail retornar null', async () => {
    const { sut, getAccountByEmailStub } = makeSut();
    jest.spyOn(getAccountByEmailStub, 'getByEmail')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null))
      );

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    });

    expect(httpResponse).toEqual(notFound(new NotFoundError('any_email@mail.com')));
  });

  test('Deveria chamar o HashComparer com os valores corretos', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'comparer');

    await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    });

    expect(hashComparerStub.comparer).toBeCalledWith('any_password', 'hashed_password');
  });
});
