import { AccountModel } from '../../../domain/models/account-model';
import { CreateAccountModel } from '../../../domain/models/create-account-model';
import { CreateAccount } from '../../../domain/use-cases/create-account';
import { CreateAccountRepository } from '../../protocols/create-account-repository';

export class DbCreateAccount implements CreateAccount {

  constructor(
    private readonly createAccountRepository: CreateAccountRepository
  ) { }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    await this.createAccountRepository.create(accountData);
  }
}
