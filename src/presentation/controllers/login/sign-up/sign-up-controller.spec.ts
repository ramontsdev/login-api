import { MissingParamError } from '../../../errors/missing-param-error';
import { badRequest } from '../../../helpers/http-helpers';
import { SignUpController } from './sign-up-controller';

describe('SignUp Controller', () => {
  test('Deveria retornar statusCode 400 se o name não for passado', async () => {
    const sut = new SignUpController();

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    });

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });
});
