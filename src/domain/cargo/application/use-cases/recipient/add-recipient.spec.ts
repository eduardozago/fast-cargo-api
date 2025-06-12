import { AddRecipientUseCase } from './add-recipient'
import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '../errors/not-allowed-error'

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
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipient.name).toEqual(recipient.name)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })

  it('should not be allowed to add a recipient if the user is not admin', async () => {
    const recipient = makeRecipient()

    const result = await sut.execute({
      name: recipient.name,
      address: recipient.address,
      role: 'DELIVERY_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
