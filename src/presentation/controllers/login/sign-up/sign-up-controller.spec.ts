import { AccountModel } from '../../../../domain/models/account-model';
import { CreateAccountModel } from '../../../../domain/models/create-account-model';
import { CreateAccount } from '../../../../domain/use-cases/create-account';
import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, serverError } from '../../../helpers/http-helpers';
import { EmailValidator } from '../../../protocols/email-validator';
import { SignUpController } from './sign-up-controller';

function makeCreateAccount() {
  class CreateAccountStub implements CreateAccount {
    async create(accountData: CreateAccountModel): Promise<AccountModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      };
    }
  }

  return new CreateAccountStub();
}

function makeEmailValidator() {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

function makeSut() {
  const emailValidatorStub = makeEmailValidator();
  const createAccountStub = makeCreateAccount();
  const sut = new SignUpController(emailValidatorStub, createAccountStub);
  return {
    sut,
    emailValidatorStub,
    createAccountStub
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
});
