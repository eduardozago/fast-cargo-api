import { RecipientsRepository } from '@/domain/cargo/application/repositories/recipients-repository'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'

export class InMemoryRecipientRepository extends RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }
}
