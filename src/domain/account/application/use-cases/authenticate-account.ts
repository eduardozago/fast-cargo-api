import { Either, left, right } from '@/core/either'
import { AccountsRepository } from '../repositories/accounts-repository'
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateAccountUseCaseRequest {
  taxId: string
  password: string
}

type AuthenticateAccountUseCaseResponse = Either<
  InvalidCredentialsError | AccountAlreadyExistsError,
  {
    accessToken: string
  }
>

export class AuthenticateAccountUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    taxId,
    password,
  }: AuthenticateAccountUseCaseRequest): Promise<AuthenticateAccountUseCaseResponse> {
    const account = await this.accountsRepository.findByTaxId(taxId)

    if (!account) {
      return left(new InvalidCredentialsError())
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      account.password,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
