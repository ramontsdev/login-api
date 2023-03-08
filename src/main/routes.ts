import { Router } from 'express';

import { adaptRoute } from './adapters/express-route-adapter';
import { makeSignUpControllerFactory } from './factories/controllers/sign-up-controller-factory';

export const routes = Router();

routes.post('/sign-up', adaptRoute(makeSignUpControllerFactory()));
