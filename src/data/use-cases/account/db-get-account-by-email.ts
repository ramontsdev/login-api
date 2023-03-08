import { AccountModel } from '../../../domain/models/account-model';
import { GetAccountByEmail } from '../../../domain/use-cases/get-account-by-email';
import { GetAccountByEmailRepository } from '../../protocols/db/get-account-by-email-repository';

export class DbGetAccountByEmail implements GetAccountByEmail {
  constructor(private readonly getAccountByRepository: GetAccountByEmailRepository) { }

  async getByEmail(email: string): Promise<AccountModel | null> {
    const account = await this.getAccountByRepository.getByEmail(email);
    return account;
  }
}
