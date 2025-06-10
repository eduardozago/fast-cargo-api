import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipient(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('driver-01'),
    )

    inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      recipientId: 'driver-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items.length).toEqual(0)
  })
})
