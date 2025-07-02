import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderCreatedEvent } from '../events/order-created-event'
import { OrderStatusChangedEvent } from '../events/order-status-changed-event'

export enum OrderStatus {
  ADDED = 'ADDED',
  AVAILABLE = 'AVAILABLE',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface OrderProps {
  driverId?: UniqueEntityID | null
  recipientId: UniqueEntityID
  status: OrderStatus
  createdAt: Date
  updatedAt?: Date
}

export class Order extends AggregateRoot<OrderProps> {
  get driverId(): UniqueEntityID | undefined | null {
    return this.props.driverId
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

  set driverId(driverId: UniqueEntityID) {
    this.props.driverId = driverId
  }

  set status(status: OrderStatus) {
    if (status !== this.props.status) {
      this.props.status = status
      this.touch()
      this.addDomainEvent(new OrderStatusChangedEvent(this))
    }
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

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order))
    }

    return order
  }
}
