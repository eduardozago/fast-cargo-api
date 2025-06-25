import { AddRecipientUseCase } from './add-recipient'
import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: AddRecipientUseCase

describe('Add Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new AddRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to add a recipient', async () => {
    const recipient = makeRecipient()

    const result = await sut.execute({
      name: recipient.name,
      address: recipient.address,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipient.name).toEqual(recipient.name)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })
})
