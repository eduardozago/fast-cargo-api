import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '../errors/not-allowed-error'

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
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items.length).toEqual(0)
  })

  it('should not be allowed to delete a recipient if the user is not admin', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      role: 'DELIVER_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
