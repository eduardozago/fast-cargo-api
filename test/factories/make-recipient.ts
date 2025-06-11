import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/cargo/enterprise/entities/recipient'
import { faker } from '@faker-js/faker'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const deliverDriver = Recipient.create(
    {
      orderId: new UniqueEntityID(),
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      ...override,
    },
    id,
  )

  return deliverDriver
}
