import { CreateAccountRepository } from '../../../../data/protocols/db/create-account-repository';
import { AccountModel } from '../../../../domain/models/account-model';
import { CreateAccountModel } from '../../../../domain/models/create-account-model';
import { mongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements CreateAccountRepository {

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection<CreateAccountModel>('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: result.insertedId });

    if (!account) {
      throw new Error('Documento não encontrado');
    }

    const { _id, ...res } = account;
    const newAccount = Object.assign({}, res, { id: _id.toString() });

    return newAccount;
  }
}
