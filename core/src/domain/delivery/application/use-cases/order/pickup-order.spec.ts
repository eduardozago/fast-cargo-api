import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { PickupOrderUseCase } from './pickup-order'
import { InMemoryDriversRepository } from 'test/respositories/in-memory-drivers-repository'
import { makeDriver } from 'test/factories/make-driver'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDriversRepository: InMemoryDriversRepository
let sut: PickupOrderUseCase

describe('Pickup Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDriversRepository = new InMemoryDriversRepository()

    sut = new PickupOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDriversRepository,
    )
  })

  it('should be able to pickup an order', async () => {
    const order = makeOrder({
      status: OrderStatus.AVAILABLE,
    })

    inMemoryOrdersRepository.items.push(order)

    const driver = makeDriver()

    inMemoryDriversRepository.items.push(driver)

    const result = await sut.execute({
      orderId: order.id.toString(),
      driverId: driver.id.toString(),
    })

    console.log(result)

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toEqual(order.id)
  })

  it('should not able to pickup an order if the status order is not "AVAILABLE"', async () => {
    const order = makeOrder({
      status: OrderStatus.ADDED,
    })

    inMemoryOrdersRepository.items.push(order)

    const driver = makeDriver()

    inMemoryDriversRepository.items.push(driver)

    const result = await sut.execute({
      orderId: order.id.toString(),
      driverId: driver.id.toString(),
    })

    console.log(result)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderStatusError)
  })
})
