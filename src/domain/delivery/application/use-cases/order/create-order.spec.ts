import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { CreateOrderUseCase } from './create-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to create an order', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
  })
})
