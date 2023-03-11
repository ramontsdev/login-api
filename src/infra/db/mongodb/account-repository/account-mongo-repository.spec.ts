import { Collection } from 'mongodb';
import { mongoHelper, mongoUri } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;

const sut = new AccountMongoRepository();

describe('AccountMongo Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('CreateAccountRepository', () => {
    test('Deveria retornar uma conta em caso de sucesso', async () => {
      const account = await sut.create({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      });

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('GetAccountByEmailRepository', () => {
    test('Deveria retornar uma conta em caso de sucesso', async () => {
      const sut = new AccountMongoRepository();

      await sut.create({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      });

      const account = await sut.getByEmail('any_email@mail.com');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });
  });
});
