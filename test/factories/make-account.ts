import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Account,
  AccountProps,
} from '@/domain/account/enterprise/entities/account'
import { AccountRole } from '@/domain/account/enterprise/entities/account-role'
import { faker } from '@faker-js/faker'

export function makeAccount(
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID,
) {
  const account = Account.create(
    {
      taxId: faker.string.numeric(),
      password: faker.internet.password(),
      role: AccountRole.OPERATOR,
      ...override,
    },
    id,
  )

  return account
}
