import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { Order } from '@/domain/cargo/enterprise/entities/order'

interface CreateOrderUseCaseRequest {
  recipientId: string
  role: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientRepository: RecipientsRepository,
  ) {}

  async execute({
    recipientId,
    role,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
