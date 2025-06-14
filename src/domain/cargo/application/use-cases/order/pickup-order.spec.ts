import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { OrderStatus } from '@/domain/cargo/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { PickupOrderUseCase } from './pickup-order'
import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryDriversRepository: InMemoryDeliveryDriverRepository
let sut: PickupOrderUseCase

describe('Pickup Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryDriversRepository = new InMemoryDeliveryDriverRepository()

    sut = new PickupOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryDriversRepository,
    )
  })

  it('should be able to pickup an order', async () => {
    const order = makeOrder({
      status: OrderStatus.AVAILABLE,
    })

    inMemoryOrdersRepository.items.push(order)

    const deliveryDriver = makeDeliveryDriver()

    inMemoryDeliveryDriversRepository.items.push(deliveryDriver)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: deliveryDriver.id.toString(),
      role: 'ADMIN',
    })

    console.log(result)

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toEqual(order.id)
  })

  it('should not authorized to pickup an order if the user is not admin', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const deliveryDriver = makeDeliveryDriver()

    inMemoryDeliveryDriversRepository.items.push(deliveryDriver)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: deliveryDriver.id.toString(),
      role: 'DELIVERY_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should not able to pickup an order if the status order is not "AVAILABLE"', async () => {
    const order = makeOrder({
      status: OrderStatus.ADDED,
    })

    inMemoryOrdersRepository.items.push(order)

    const deliveryDriver = makeDeliveryDriver()

    inMemoryDeliveryDriversRepository.items.push(deliveryDriver)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryDriverId: deliveryDriver.id.toString(),
      role: 'ADMIN',
    })

    console.log(result)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderStatusError)
  })
})
