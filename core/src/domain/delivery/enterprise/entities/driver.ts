import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DriverProps {
  accountId: UniqueEntityID
  orderId?: UniqueEntityID
  name: string
}

export class Driver extends Entity<DriverProps> {
  get accountId() {
    return this.props.accountId
  }

  get orderId() {
    return this.props.orderId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  static create(props: DriverProps, id?: UniqueEntityID) {
    const driver = new Driver(props, id)

    return driver
  }
}
