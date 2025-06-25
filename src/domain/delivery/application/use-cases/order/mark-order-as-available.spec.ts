import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { MarkOrderAsAvailableUseCase } from './mark-order-as-available'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
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
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toEqual(order.id)
  })

  it('should not able to mark an order as available if the status order is not "ADDED"', async () => {
    const order = makeOrder({
      status: OrderStatus.DELIVERED,
    })

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderStatusError)
  })
})
