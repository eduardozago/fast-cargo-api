import { InMemoryAccountsRepository } from 'test/respositories/in-memory-accounts-repository'
import { CreateAccountUseCase } from './create-account'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAccount } from 'test/factories/make-account'
import { InvalidAccountRoleError } from '../errors/invalid-account-role-error'
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error'

let inMemoryAccountsRepository: InMemoryAccountsRepository
let hashGenerator: FakeHasher
let sut: CreateAccountUseCase

describe('Create Account', () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository()
    hashGenerator = new FakeHasher()

    sut = new CreateAccountUseCase(inMemoryAccountsRepository, hashGenerator)
  })

  it('should be able create a account', async () => {
    const result = await sut.execute({
      taxId: '12345678900',
      password: '123',
      role: 'OPERATOR',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      account: inMemoryAccountsRepository.items[0],
    })
  })

  it('should not be able to create a account with and invalid role', async () => {
    const account = makeAccount()

    const result = await sut.execute({
      taxId: account.taxId,
      password: account.password,
      role: 'INVALID_ROLE',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccountRoleError)
  })

  it('should not be able to create an account with same tax id', async () => {
    const account = makeAccount()

    inMemoryAccountsRepository.items.push(account)

    const result = await sut.execute({
      taxId: account.taxId,
      password: account.password,
      role: account.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError)
  })

  it('should hash account password', async () => {
    const result = await sut.execute({
      taxId: '12345678900',
      password: '123',
      role: 'OPERATOR',
    })

    const hashedPassword = await hashGenerator.hash('123')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountsRepository.items[0].password).toEqual(hashedPassword)
  })
})
