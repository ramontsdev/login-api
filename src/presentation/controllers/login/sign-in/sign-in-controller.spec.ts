import { MissingParamError } from '../../../errors/missing-param-error';
import { badRequest } from '../../../helpers/http-helpers';
import { SignInController } from './sign-in-controller';

function makeSut() {
  const sut = new SignInController();
  return {
    sut
  };
}

describe('SignIn Controller', () => {
  test('Deveria retornar badRequest caso e-mail não seja passado', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
});
