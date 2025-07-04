import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order, OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { DriversRepository } from '../../repositories/drivers-repository'

interface PickupOrderUseCaseRequest {
  orderId: string
  driverId: string
}

type PickupOrderUseCaseResponse = Either<
  ResourceNotFoundError | InvalidOrderStatusError,
  {
    order: Order
  }
>

export class PickupOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private driversRepository: DriversRepository,
  ) {}

  async execute({
    orderId,
    driverId,
  }: PickupOrderUseCaseRequest): Promise<PickupOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const driver = await this.driversRepository.findById(driverId)

    if (!driver) {
      return left(new ResourceNotFoundError())
    }

    order.driverId = driver.id

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
