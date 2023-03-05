import { AccountModel } from '../models/account-model';
import { CreateAccountModel } from '../models/create-account-model';

export interface CreateAccount {
  create(accountData: CreateAccountModel): Promise<AccountModel>;
}
