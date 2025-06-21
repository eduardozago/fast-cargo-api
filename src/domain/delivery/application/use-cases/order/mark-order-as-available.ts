import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'

interface MarkOrderAsAvailableUseCaseRequest {
  orderId: string
}

type MarkOrderAsAvailableUseCaseResponse = Either<
  ResourceNotFoundError | InvalidOrderStatusError,
  {
    order: Order
  }
>

export class MarkOrderAsAvailableUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: MarkOrderAsAvailableUseCaseRequest): Promise<MarkOrderAsAvailableUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== OrderStatus.ADDED) {
      return left(new InvalidOrderStatusError(order.status, OrderStatus.ADDED))
    }

    order.status = OrderStatus.AVAILABLE

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
