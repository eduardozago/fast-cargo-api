import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Driver,
  DriverProps,
} from '@/domain/delivery/enterprise/entities/driver'
import { faker } from '@faker-js/faker'

export function makeDriver(
  override: Partial<DriverProps> = {},
  id?: UniqueEntityID,
) {
  const deliverDriver = Driver.create(
    {
      accountId: new UniqueEntityID(),
      name: faker.person.fullName(),
      ...override,
    },
    id,
  )

  return deliverDriver
}
