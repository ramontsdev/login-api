import { AccountModel } from './account-model';

export type CreateAccountModel = Omit<AccountModel, 'id' | 'createdAt'>;
