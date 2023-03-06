import { CreateAccount } from '../../../../domain/use-cases/create-account';
import { GetAccountByEmail } from '../../../../domain/use-cases/get-account-by-email';
import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, created, serverError, unprocessableEntity } from '../../../helpers/http-helpers';
import { Controller } from '../../../protocols/controller';
import { EmailValidator } from '../../../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount,
    private readonly getAccountByEmail: GetAccountByEmail
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, name, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.getAccountByEmail.getByEmail(email);
      if (account) {
        return unprocessableEntity(new Error('Email already in use'));
      }

      const newAccount = await this.createAccount.create({
        name, email, password
      });

      return created(newAccount);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
