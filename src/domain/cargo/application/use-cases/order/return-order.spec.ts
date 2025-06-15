import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { OrderStatus } from '@/domain/cargo/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'
import { ReturnOrderUseCase } from './return-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: ReturnOrderUseCase

describe('Return Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new ReturnOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able return an order', async () => {
    const order = makeOrder({
      status: OrderStatus.PICKED_UP,
    })

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'ADMIN',
    })

    console.log(result)

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toEqual(order.id)
  })

  it('should not authorized to return an order if the user is not admin', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'DELIVERY_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should not able to return an order if the status order is not "PICKED_UP"', async () => {
    const order = makeOrder({
      status: OrderStatus.DELIVERED,
    })

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'ADMIN',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderStatusError)
  })
})
