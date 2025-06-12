import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { OrdersRepository } from '../../repositories/orders-repository'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { NotAllowedError } from '../errors/not-allowed-error'

interface DeleteOrderUseCaseRequest {
  orderId: string
  role: string
}

type DeleteOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

export class DeleteOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    role,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    await this.ordersRepository.delete(order)

    return right(null)
  }
}
