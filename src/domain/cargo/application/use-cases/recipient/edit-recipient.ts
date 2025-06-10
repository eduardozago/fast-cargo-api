import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'
import { RecipientsRepository } from '../../repositories/recipients-repository'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  address: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
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
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
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
