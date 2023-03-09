import { Collection } from 'mongodb';
import request from 'supertest';

import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { environment } from '../environment';
import { server } from '../server';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(environment.mongoUrl);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /sign-up', () => {
    test('Should return 201 an account on sign up', async () => {
      await request(server)
        .post('/api/sign-up')
        .send({
          name: 'Ramon',
          email: 'ramon@mail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(201);
    });
  });
});
