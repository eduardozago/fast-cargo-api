import { Account } from '../../enterprise/entities/account'

export abstract class AccountsRepository {
  abstract findByTaxId(taxId: string): Promise<Account | null>
  abstract create(account: Account): Promise<void>
}
