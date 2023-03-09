import { Router } from 'express';

import { adaptRoute } from './adapters/express-route-adapter';
import { makeSignInController } from './factories/controllers/sign-in-controller-factory';
import { makeSignUpController } from './factories/controllers/sign-up-controller-factory';

export const routes = Router();

routes.post('/sign-up', adaptRoute(makeSignUpController()));
routes.post('/sign-in', adaptRoute(makeSignInController()));
