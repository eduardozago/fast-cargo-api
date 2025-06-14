import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { Order, OrderStatus } from '@/domain/cargo/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { UnauthorizedError } from '../errors/unauthorized-error'

interface ReturnOrderUseCaseRequest {
  orderId: string
  role: string
}

type ReturnOrderUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | InvalidOrderStatusError,
  {
    order: Order
  }
>

export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    role,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new UnauthorizedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new UnauthorizedError())
    }

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
