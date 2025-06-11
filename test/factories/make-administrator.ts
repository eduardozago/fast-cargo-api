import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/cargo/enterprise/entities/administrator'
import { faker } from '@faker-js/faker'

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      taxId: faker.string.numeric(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return administrator
}
