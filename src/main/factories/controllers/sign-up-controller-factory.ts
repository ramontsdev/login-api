import { DbCreateAccount } from '../../../data/use-cases/account/db-create-account';
import { DbGetAccountByEmail } from '../../../data/use-cases/account/db-get-account-by-email';
import { Authentication } from '../../../infra/authentication/authentication';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/login/sign-up/sign-up-controller';
import { EmailValidatorAdapter } from '../../adapters/email-validator-adapter';

export function makeSignUpController() {

  const emailValidatorAdapter = new EmailValidatorAdapter();

  const accountMongoRepository = new AccountMongoRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const dbCreateAccount = new DbCreateAccount(accountMongoRepository, bcryptAdapter);

  const dbGetAccountByEmail = new DbGetAccountByEmail(accountMongoRepository);

  const jwtAdapter = new JwtAdapter('secret');
  const authentication = new Authentication(jwtAdapter);

  return new SignUpController(emailValidatorAdapter, dbCreateAccount, dbGetAccountByEmail, authentication);
}
