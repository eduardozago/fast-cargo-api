import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AccountRole } from './account-role'

export interface AccountProps {
  profileId?: UniqueEntityID
  taxId: string
  password: string
  role: AccountRole
}

export class Account extends Entity<AccountProps> {
  get profileId() {
    return this.props.profileId
  }

  get taxId() {
    return this.props.taxId
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: AccountProps, id?: UniqueEntityID) {
    const account = new Account(props, id)

    return account
  }
}
