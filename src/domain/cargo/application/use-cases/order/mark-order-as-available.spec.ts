import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { MarkOrderAsAvailableUseCase } from './mark-order-as-available'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { OrderStatus } from '@/domain/cargo/enterprise/entities/order'
import { InvalidOrderStatusError } from '../errors/invalid-order-status-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsAvailableUseCase

describe('Mark Order as Available', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new MarkOrderAsAvailableUseCase(inMemoryOrdersRepository)
  })

  it('should be able to mark an order as available', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toEqual(order.id)
  })

  it('should not authorized to mark an order as available if the user is not admin', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'DELIVERY_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should not able to mark an order as available if the status order is not "added"', async () => {
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
