import { UseCaseError } from '@/core/errors/use-case-error'
import { OrderStatus } from '@/domain/cargo/enterprise/entities/order'

export class InvalidOrderStatusError extends Error implements UseCaseError {
  constructor(
    currentOrderStatus: OrderStatus,
    expectedOrderStatus: OrderStatus,
  ) {
    super(
      `Invalid order status. Current status is "${currentOrderStatus}" expected "${expectedOrderStatus}"`,
    )
  }
}
