import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryManProps {
  orderId?: UniqueEntityID
  taxId: string
  name: string
  password: string
}

export class DeliveryMan extends Entity<DeliveryManProps> {
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

  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    const deliverMan = new DeliveryMan(props, id)

    return deliverMan
  }
}
