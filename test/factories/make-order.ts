import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Order,
  OrderProps,
  OrderStatus,
} from '@/domain/cargo/enterprise/entities/order'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const deliverDriver = Order.create(
    {
      deliveryDriverId: new UniqueEntityID(),
      recipientId: new UniqueEntityID(),
      status: OrderStatus.WAITING,
      ...override,
    },
    id,
  )

  return deliverDriver
}
