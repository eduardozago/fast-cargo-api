import { RecipientsRepository } from '@/domain/cargo/application/repositories/recipients-repository'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'

export class InMemoryRecipientRepository extends RecipientsRepository {
  public items: Recipient[] = []

  async create(deliverDriver: Recipient) {
    this.items.push(deliverDriver)
  }
}
