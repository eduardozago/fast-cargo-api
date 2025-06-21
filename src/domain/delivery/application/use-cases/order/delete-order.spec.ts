import { DeleteOrderUseCase } from './delete-order'
import { makeOrder } from 'test/factories/make-order'
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
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items.length).toEqual(0)
  })
})
