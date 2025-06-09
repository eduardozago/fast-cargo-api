import { AddRecipientUseCase } from './add-recipient'
import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { NotAllowedError } from '../errors/not-allowed-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: AddRecipientUseCase

describe('Add Recipient', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new AddRecipientUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to add a recipient', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const recipient = makeRecipient({
      orderId: order.id,
    })

    const result = await sut.execute({
      orderId: order.id.toString(),
      name: recipient.name,
      address: recipient.address,
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipient.name).toEqual(recipient.name)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })

  it('should not be allowed to add a recipient if the user is not admin', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const recipient = makeRecipient({
      orderId: order.id,
    })

    const result = await sut.execute({
      orderId: order.id.toString(),
      name: recipient.name,
      address: recipient.address,
      role: 'DELIVERY_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
