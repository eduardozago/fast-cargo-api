import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/cargo/enterprise/entities/delivery-man'
import { faker } from '@faker-js/faker'

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliverMan = DeliveryMan.create(
    {
      taxId: faker.string.numeric(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliverMan
}
