import { DeleteOrderUseCase } from './delete-order'
import { makeOrder } from 'test/factories/make-order'
import { NotAllowedError } from '../errors/not-allowed-error'
import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete an order', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items.length).toEqual(0)
  })

  it('should not be allowed to delete an order if the user is not admin', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      role: 'DELIVER_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
