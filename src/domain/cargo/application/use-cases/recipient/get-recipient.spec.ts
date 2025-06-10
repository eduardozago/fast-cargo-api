import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { GetRecipientUseCase } from './get-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: GetRecipientUseCase

describe('Get Delivery Driver', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new GetRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to add a delivery driver', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipient.name).toEqual(recipient.name)
  })
})
