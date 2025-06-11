import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { NotAllowedError } from '../errors/not-allowed-error'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
  role: string
}

type DeleteRecipientUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    role,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
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

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
