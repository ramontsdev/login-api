import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail: () => true
}));

const sut = new EmailValidatorAdapter();

describe('EmailValidator Adapter', () => {
  test('Deveria chamar o isEmail com o email correto', () => {
    jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@mail.com');

    expect(validator.isEmail).toBeCalledWith('any_email@mail.com');
  });

  test('Deveria retornar false se o validator retornar false', () => {
    jest.spyOn(validator, 'isEmail')
      .mockReturnValueOnce(false);

    const isValid = sut.isValid('any_email@mail.com');

    expect(isValid).toBe(false);
  });

  test('Deveria retornar true se o validator retornar true', () => {
    const isValid = sut.isValid('any_email@mail.com');

    expect(isValid).toBe(true);
  });
});
