import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '../errors/not-allowed-error'
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
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
  })

  it('should not be allowed to create an order if the user is not admin', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      role: 'DELIVERY_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
