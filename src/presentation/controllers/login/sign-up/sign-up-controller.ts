import { MissingParamError } from '../../../errors/missing-param-error';
import { badRequest } from '../../../helpers/http-helpers';
import { Controller } from '../../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../../protocols/http';

export class SignUpController implements Controller {

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('name'));
  }
}
