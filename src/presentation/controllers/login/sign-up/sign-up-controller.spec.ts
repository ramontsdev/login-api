import { AccountModel } from '../../../../domain/models/account-model';
import { CreateAccountModel } from '../../../../domain/models/create-account-model';
import { Authenticator } from '../../../../domain/use-cases/authenticator';
import { CreateAccount } from '../../../../domain/use-cases/create-account';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, created, serverError, unprocessableEntity } from '../../../helpers/http-helpers';
import { EmailValidator } from '../../../protocols/email-validator';
import { SignUpController } from './sign-up-controller';

const fakeAccount = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
};

function makeEmailValidator() {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

function makeCreateAccount() {
  class CreateAccountStub implements CreateAccount {
    async create(accountData: CreateAccountModel): Promise<AccountModel> {
      return fakeAccount;
    }
  }

  return new CreateAccountStub();
}

function makeGetAccountByEmail() {
  class GetAccountByEmailStub implements GetAccountByEmail {
    async getByEmail(email: string): Promise<AccountModel | null> {
      return null;
    }
  }

  return new GetAccountByEmailStub();
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
  const emailValidatorStub = makeEmailValidator();
  const createAccountStub = makeCreateAccount();
  const getAccountByEmailStub = makeGetAccountByEmail();
  const authenticatorStub = makeAuthenticator();
  const sut = new SignUpController(emailValidatorStub, createAccountStub, getAccountByEmailStub, authenticatorStub);
  return {
    sut,
    emailValidatorStub,
    createAccountStub,
    getAccountByEmailStub,
    authenticatorStub
  };
}

describe('SignUp Controller', () => {
  test('Deveria retornar statusCode 400 se o name não for passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Deveria retornar statusCode 400 se o email não for passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Deveria retornar statusCode 400 se o password não for passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Deveria retornar statusCode 400 se o passwordConfirmation não for passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')));
  });

  test('Deveria chamar o EmailValidator com o valor correto', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(emailValidatorStub.isValid).toBeCalledWith('any_email@mail.com');
  });

  test('Deveria retornar um statusCode 400 se o e-mail for inválido', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false);

    const httpRequest = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpRequest).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Deveria retornar um statusCode 500 se o e-mail lançar um erro', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    const httpRequest = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpRequest).toEqual(serverError(new ServerError()));
  });

  test('Deveria chamar o CreateAccount com os valores corretos', async () => {
    const { sut, createAccountStub } = makeSut();
    jest.spyOn(createAccountStub, 'create');

    await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(createAccountStub.create).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Deveria retornar um statusCode 500 se o CreateAccount lançar um erro', async () => {
    const { sut, createAccountStub } = makeSut();
    jest.spyOn(createAccountStub, 'create')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error))
      );

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Deveria chamar GetAccountByEmail com o valor correto', async () => {
    const { sut, getAccountByEmailStub } = makeSut();
    jest.spyOn(getAccountByEmailStub, 'getByEmail');

    await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(getAccountByEmailStub.getByEmail).toBeCalledWith('any_email@mail.com');
  });

  test('Deveria retornar statusCode 422 se GetAccountByEmail retornar uma conta', async () => {
    const { sut, getAccountByEmailStub } = makeSut();
    jest.spyOn(getAccountByEmailStub, 'getByEmail').mockReturnValueOnce(
      new Promise(resolve => resolve(fakeAccount))
    );

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(unprocessableEntity(new Error('Email already in use')));
  });

  test('Deveria retornar statusCode 500 se o Authenticator lançar erro', async () => {
    const { sut, authenticatorStub } = makeSut();
    jest.spyOn(authenticatorStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });



  test('Deveria retornar um statusCode 201 em caso de sucesso', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(created({ accessToken: 'access_token' }));
  });
});
