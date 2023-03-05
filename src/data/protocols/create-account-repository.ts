import { AccountModel } from '../../domain/models/account-model';
import { CreateAccountModel } from '../../domain/models/create-account-model';

export interface CreateAccountRepository {
  create(accountData: CreateAccountModel): Promise<AccountModel>;
}
