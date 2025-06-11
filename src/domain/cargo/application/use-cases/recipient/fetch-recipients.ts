import { Either, right } from '@/core/either'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'
import { RecipientsRepository } from '../../repositories/recipients-repository'

interface FetchRecipientsUseCaseRequest {
  page: number
}

type FetchRecipientsUseCaseResponse = Either<
  null,
  {
    recipients: Recipient[]
  }
>

export class FetchRecipientsUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientRepository.findAll({
      page,
    })

    return right({
      recipients,
    })
  }
}
