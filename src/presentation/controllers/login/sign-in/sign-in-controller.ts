import { HashComparer } from '../../../../data/protocols/cryptography/hash-comparer';
import { Authenticator } from '../../../../domain/use-cases/authenticator';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, notFound, serverError } from '../../../helpers/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class SignInController implements Controller {

  constructor(
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly hashComparer: HashComparer,
    private readonly authenticator: Authenticator
  ) { }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
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

      const isValidPassword = await this.hashComparer.comparer(password, account.password);
      if (!isValidPassword) {
        return badRequest(new InvalidParamError('password'));
      }

      await this.authenticator.auth(account.id);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
