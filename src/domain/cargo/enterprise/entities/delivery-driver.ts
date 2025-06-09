import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryDriverProps {
  orderId?: UniqueEntityID
  taxId: string
  name: string
  password: string
}

export class DeliveryDriver extends Entity<DeliveryDriverProps> {
  get orderId() {
    return this.props.orderId
  }

  get taxId() {
    return this.props.taxId
  }

  get name() {
    return this.props.name
  }

  get password() {
    return this.props.password
  }

  set name(name: string) {
    this.props.name = name
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: DeliveryDriverProps, id?: UniqueEntityID) {
    const deliverDriver = new DeliveryDriver(props, id)

    return deliverDriver
  }
}
