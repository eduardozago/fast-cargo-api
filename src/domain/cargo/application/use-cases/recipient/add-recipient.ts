import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'

interface AddRecipientUseCaseRequest {
  name: string
  address: string
  role: string
}

type AddRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class AddRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    name,
    address,
    role,
  }: AddRecipientUseCaseRequest): Promise<AddRecipientUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

    const recipient = Recipient.create({
      name,
      address,
    })

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
