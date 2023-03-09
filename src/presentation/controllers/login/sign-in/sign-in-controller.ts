import { HashComparer } from '../../../../data/protocols/cryptography/hash-comparer';
import { Authenticator } from '../../../../domain/use-cases/authenticator';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, notFound, ok, serverError } from '../../../helpers/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class SignInController implements Controller {

  constructor(
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly hashComparer: HashComparer,
    private readonly authenticator: Authenticator
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;

      const account = await this.getAccountByEmail.getByEmail(email);
      if (!account) {
        return notFound(new NotFoundError(email));
      }

      const isValidPassword = await this.hashComparer.compare(password, account.password);
      if (!isValidPassword) {
        return badRequest(new InvalidParamError('password'));
      }

      const accessToken = await this.authenticator.auth(account.id);

      return ok({ accessToken });
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
