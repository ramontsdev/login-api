import { AccountModel } from '../../../domain/models/account-model';
import { CreateAccountModel } from '../../../domain/models/create-account-model';
import { CreateAccount } from '../../../domain/use-cases/create-account';
import { Hasher } from '../../protocols/cryptography/hasher';
import { CreateAccountRepository } from '../../protocols/db/create-account-repository';

export class DbCreateAccount implements CreateAccount {

  constructor(
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly hasher: Hasher
  ) { }

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const hash = await this.hasher.hash(accountData.password);
    const account = await this.createAccountRepository.create({
      ...accountData,
      password: hash
    });
    return account;
  }
}
