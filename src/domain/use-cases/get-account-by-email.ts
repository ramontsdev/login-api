import { AccountModel } from '../models/account-model';

export interface GetAccountByEmail {
  getByEmail(email: string): Promise<AccountModel | null>;
}
