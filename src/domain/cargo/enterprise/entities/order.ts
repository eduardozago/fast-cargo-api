import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Optional } from '../../../../core/types/optional'
import { Entity } from '@/core/entities/entity'

export enum OrderStatus {
  ADDED = 'ADDED',
  AVAILABLE = 'AVAILABLE',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface OrderProps {
  deliveryDriverId?: UniqueEntityID
  recipientId: UniqueEntityID
  status: OrderStatus
  createdAt: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get deliveryDriverId() {
    return this.props.deliveryDriverId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set status(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }

  static create(
    props: Optional<OrderProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? OrderStatus.ADDED,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
