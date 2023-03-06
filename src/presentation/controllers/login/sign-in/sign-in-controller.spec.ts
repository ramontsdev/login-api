import { AccountModel } from '../../../../domain/models/account-model';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { MissingParamError } from '../../../errors/missing-param-error';
import { badRequest } from '../../../helpers/http-helpers';
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

function makeSut() {
  const getAccountByEmailStub = makeGetAccountByEmail();
  const sut = new SignInController(getAccountByEmailStub);
  return {
    sut,
    getAccountByEmailStub
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
});
