import { Either, left, right } from '@/core/either'
import { AccountRole } from '../../enterprise/entities/account-role'
import { InvalidAccountRoleError } from '../errors/invalid-account-role-error'
import { AccountsRepository } from '../repositories/accounts-repository'
import { Account } from '../../enterprise/entities/account'
import { HashGenerator } from '../cryptography/hash-generator'
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error'

interface CreateAccountUseCaseRequest {
  taxId: string
  password: string
  role: string
}

type CreateAccountUseCaseResponse = Either<
  InvalidAccountRoleError | AccountAlreadyExistsError,
  {
    account: Account
  }
>

export class CreateAccountUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    taxId,
    password,
    role,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const isValidRole = Object.values(AccountRole).includes(role as AccountRole)

    if (!isValidRole) {
      return left(new InvalidAccountRoleError())
    }

    const accountRole = role as AccountRole

    const accountWithSameTaxId =
      await this.accountsRepository.findByTaxId(taxId)

    if (accountWithSameTaxId) {
      return left(new AccountAlreadyExistsError(taxId))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const account = Account.create({
      taxId,
      password: hashedPassword,
      role: accountRole,
    })

    await this.accountsRepository.create(account)

    return right({
      account,
    })
  }
}
