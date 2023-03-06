import { InvalidParamError } from '../../../errors/invalid-param-error';
import { MissingParamError } from '../../../errors/missing-param-error';
import { ServerError } from '../../../errors/server-error';
import { badRequest, serverError } from '../../../helpers/http-helpers';
import { Controller } from '../../../protocols/controller';
import { EmailValidator } from '../../../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator
  ) { }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
