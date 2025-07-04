import { Either, right } from '@/core/either'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

interface AddRecipientUseCaseRequest {
  name: string
  address: string
}

type AddRecipientUseCaseResponse = Either<
  null,
  {
    recipient: Recipient
  }
>

export class AddRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    name,
    address,
  }: AddRecipientUseCaseRequest): Promise<AddRecipientUseCaseResponse> {
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
