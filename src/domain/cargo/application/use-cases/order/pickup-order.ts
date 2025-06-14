import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { Order, OrderStatus } from '@/domain/cargo/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'

interface PickupOrderUseCaseRequest {
  orderId: string
  deliveryDriverId: string
  role: string
}

type PickupOrderUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError | InvalidOrderStatusError,
  {
    order: Order
  }
>

export class PickupOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryDriversRepository: DeliveryDriverRepository,
  ) {}

  async execute({
    orderId,
    deliveryDriverId,
    role,
  }: PickupOrderUseCaseRequest): Promise<PickupOrderUseCaseResponse> {
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

    const deliveryDriver =
      await this.deliveryDriversRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== OrderStatus.AVAILABLE) {
      return left(
        new InvalidOrderStatusError(order.status, OrderStatus.AVAILABLE),
      )
    }

    order.status = OrderStatus.PICKED_UP

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
