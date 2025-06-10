import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { RecipientsRepository } from '../../repositories/recipients-repository'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
