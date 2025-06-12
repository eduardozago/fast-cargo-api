import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Order } from '@/domain/cargo/enterprise/entities/order'
import { OrdersRepository } from '../../repositories/orders-repository'

interface GetOrderUseCaseRequest {
  orderId: string
}

type GetOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}
