import { InMemoryAccountsRepository } from 'test/respositories/in-memory-accounts-repository'
import { CreateAccountUseCase } from './create-account'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAccount } from 'test/factories/make-account'
import { InvalidAccountRoleError } from '../errors/invalid-account-role-error'
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error'
import { AuthenticateAccountUseCase } from './authenticate-account'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let hashGenerator: FakeHasher
let encrypt: FakeEncrypter
let sut: AuthenticateAccountUseCase

describe('Authenticate Account', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    encrypt = new FakeEncrypter()
    hashGenerator = new FakeHasher()

    sut = new AuthenticateAccountUseCase(
      inMemoryAccountsRepository,
      hashGenerator,
      encrypt,
    )
  })

  it.only('should be able authenticate an account', async () => {
    const account = makeAccount({
      taxId: '12345678900',
      password: await hashGenerator.hash('123'),
    })

    inMemoryAccountsRepository.items.push(account)

    const result = await sut.execute({
      taxId: '12345678900',
      password: '123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
