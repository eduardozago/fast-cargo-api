import { AccountsRepository } from '@/domain/account/application/repositories/accounts-repository'
import { Account } from '@/domain/account/enterprise/entities/account'

export class InMemoryAccountsRepository extends AccountsRepository {
  public items: Account[] = []

  async findByTaxId(taxId: string): Promise<Account | null> {
    const deliverDriver = this.items.find((item) => item.taxId === taxId)

    if (!deliverDriver) {
      return null
    }

    return deliverDriver
  }

  async create(account: Account) {
    this.items.push(account)
  }
}
