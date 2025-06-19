import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryDriver,
  DeliveryDriverProps,
} from '@/domain/delivery/enterprise/entities/delivery-driver'
import { faker } from '@faker-js/faker'

export function makeDeliveryDriver(
  override: Partial<DeliveryDriverProps> = {},
  id?: UniqueEntityID,
) {
  const deliverDriver = DeliveryDriver.create(
    {
      taxId: faker.string.numeric(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliverDriver
}
