import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { NotAllowedError } from '../errors/not-allowed-error'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  address: string
  role: string
}

type EditRecipientUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    name,
    address,
    role,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.address = address

    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
