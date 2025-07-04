import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'

interface ReturnOrderUseCaseRequest {
  orderId: string
}

type ReturnOrderUseCaseResponse = Either<
  ResourceNotFoundError | InvalidOrderStatusError,
  {
    order: Order
  }
>

export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== OrderStatus.PICKED_UP) {
      return left(
        new InvalidOrderStatusError(order.status, OrderStatus.PICKED_UP),
      )
    }

    order.status = OrderStatus.RETURNED

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
