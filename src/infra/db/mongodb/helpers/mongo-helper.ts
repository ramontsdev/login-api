import { Document, MongoClient } from 'mongodb';

class MongoHelper {
  client: MongoClient | null = null;
  uri = '';

  async connect(uri: string) {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  }

  async disconnect() {
    await this.client?.close();
    this.client = null;
  }

  async getCollection<T extends Document>(collectionName: string) {
    if (!this.client) {
      this.client = await MongoClient.connect(this.uri);
    }

    return this.client.db().collection<T>(collectionName);
  }
}

export const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/auth-login-api';

const mongoHelper = new MongoHelper();

export { mongoHelper };
