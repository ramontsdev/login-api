import { HashComparer } from '../../../../data/protocols/cryptography/hash-comparer';
import { AccountModel } from '../../../../domain/models/account-model';
import { Authenticator } from '../../../../domain/use-cases/authenticator';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, notFound, ok, serverError } from '../../../helpers/http-helpers';
import { SignInController } from './sign-in-controller';

const fakeAccount = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  createdAt: new Date()
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
    async compare(value: string, hash: string) {
      return true;
    }
  }

  return new HashComparerStub();
}

function makeAuthenticator() {
  class AuthenticatorStub implements Authenticator {
    async auth(value: any): Promise<string> {
      return 'access_token';
    }
  }

  return new AuthenticatorStub();
}

function makeSut() {
  const getAccountByEmailStub = makeGetAccountByEmail();
  const hashComparerStub = makeHashComparer();
  const authenticatorStub = makeAuthenticator();
  const sut = new SignInController(getAccountByEmailStub, hashComparerStub, authenticatorStub);
  return {
    sut,
    getAccountByEmailStub,
    hashComparerStub,
    authenticatorStub
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

  describe('GetAccountByEmail', () => {
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

    test('Deveria retornar statusCode 500 se o GetAccountByEmail lançar um erro', async () => {
      const { sut, getAccountByEmailStub } = makeSut();
      jest.spyOn(getAccountByEmailStub, 'getByEmail')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        );

      const httpResponse = await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(httpResponse).toEqual(serverError(new ServerError()));
    });
  });

  describe('HashComparer', () => {
    test('Deveria chamar o HashComparer com os valores corretos', async () => {
      const { sut, hashComparerStub } = makeSut();
      jest.spyOn(hashComparerStub, 'compare');

      await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(hashComparerStub.compare).toBeCalledWith('any_password', 'hashed_password');
    });

    test('Deveria retornar 400 se o HashComparer retornar false', async () => {
      const { sut, hashComparerStub } = makeSut();
      jest.spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(
          new Promise(resolve => resolve(false))
        );

      const httpResponse = await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')));
    });

    test('Deveria retornar statusCode 500 se o HashComparer lançar um erro', async () => {
      const { sut, hashComparerStub } = makeSut();
      jest.spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        );

      const httpResponse = await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(httpResponse).toEqual(serverError(new ServerError()));
    });
  });

  describe('Authenticator', () => {
    test('Deveria chamar o Authenticator com o valor correto', async () => {
      const { sut, authenticatorStub } = makeSut();
      jest.spyOn(authenticatorStub, 'auth');

      await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(authenticatorStub.auth).toBeCalledWith('any_id');
    });

    test('Deveria chamar o Authenticator com o valor correto', async () => {
      const { sut, authenticatorStub } = makeSut();
      jest.spyOn(authenticatorStub, 'auth');

      await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(authenticatorStub.auth).toBeCalledWith('any_id');
    });

    test('Deveria retornar statusCode 500 se o Authenticator lançar erro', async () => {
      const { sut, authenticatorStub } = makeSut();
      jest.spyOn(authenticatorStub, 'auth')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        );

      const httpResponse = await sut.handle({
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      });

      expect(httpResponse).toEqual(serverError(new ServerError()));
    });
  });

  test('Deveria retornar um accessToken em caso de sucesso', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    });

    expect(httpResponse).toEqual(ok({ accessToken: 'access_token' }));
  });
});
