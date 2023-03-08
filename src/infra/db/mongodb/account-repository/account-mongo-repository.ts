
import { CreateAccountRepository } from '../../../../data/protocols/db/create-account-repository';
import { GetAccountByEmailRepository } from '../../../../data/protocols/db/get-account-by-email-repository';
import { AccountModel } from '../../../../domain/models/account-model';
import { CreateAccountModel } from '../../../../domain/models/create-account-model';
import { mongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements
  CreateAccountRepository,
  GetAccountByEmailRepository {

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: result.insertedId });

    if (!account) {
      throw new Error('Documento não encontrado');
    }

    return mongoHelper.mapDocument<AccountModel>(account);
  }

  async getByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await mongoHelper.getCollection<CreateAccountModel>('accounts');
    const result = await accountCollection.findOne({ email });

    if (result) {
      return mongoHelper.mapDocument<AccountModel>(result);
    }

    return null;
  }
}
