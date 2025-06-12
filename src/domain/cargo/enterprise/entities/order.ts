import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Optional } from '../../../../core/types/optional'
import { Entity } from '@/core/entities/entity'

export enum OrderStatus {
  WAITING = 'WAITING',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface OrderProps {
  deliveryDriverId?: UniqueEntityID
  recipientId: UniqueEntityID
  status?: OrderStatus
  createdAt: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  static create(
    props: Optional<OrderProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? OrderStatus.WAITING,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
