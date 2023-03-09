import { DbGetAccountByEmail } from '../../../data/use-cases/account/db-get-account-by-email';
import { Authentication } from '../../../infra/authentication/authentication';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository';
import { SignInController } from '../../../presentation/controllers/login/sign-in/sign-in-controller';
import { BcryptAdapter } from '../../adapters/bcrypt-adapter';

export function makeSignInController() {

  const accountMongoRepository = new AccountMongoRepository();
  const dbGetAccountByEmail = new DbGetAccountByEmail(accountMongoRepository);

  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);

  const jwtAdapter = new JwtAdapter('secret');
  const authentication = new Authentication(jwtAdapter);

  return new SignInController(dbGetAccountByEmail, bcryptAdapter, authentication);
}
