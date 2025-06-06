import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export interface DeliveryManProps {
  orderId: UniqueEntityID
  taxId: string
  name: string
  password: string
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    const deliverMan = new DeliveryMan(props, id)

    return deliverMan
  }
}
