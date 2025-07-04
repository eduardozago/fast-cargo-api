import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { GetOrderUseCase } from './get-order'
import { makeOrder } from 'test/factories/make-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderUseCase

describe('Get Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new GetOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to add a order', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toEqual(order.id)
  })
})
