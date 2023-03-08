import { AccountModel } from '../../../domain/models/account-model';

export interface GetAccountByEmailRepository {
  getByEmail(email: string): Promise<AccountModel | null>;
}
