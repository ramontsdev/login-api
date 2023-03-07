import { HashComparer } from '../../../../data/protocols/cryptography/hash-comparer';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { MissingParamError } from '../../../errors/missing-param-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { badRequest, notFound } from '../../../helpers/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class SignInController implements Controller {

  constructor(
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly hashComparer: HashComparer
  ) { }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

    await this.hashComparer.comparer(password, account.password);
  }
}
