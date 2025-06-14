import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { Order, OrderStatus } from '@/domain/cargo/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { UnauthorizedError } from '../errors/unauthorized-error'

interface MarkOrderAsAvailableUseCaseRequest {
  orderId: string
  role: string
}

type MarkOrderAsAvailableUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | InvalidOrderStatusError,
  {
    order: Order
  }
>

export class MarkOrderAsAvailableUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    role,
  }: MarkOrderAsAvailableUseCaseRequest): Promise<MarkOrderAsAvailableUseCaseResponse> {
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
