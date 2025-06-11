import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { EditRecipientUseCase } from './edit-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '../errors/not-allowed-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to edit a recipient', async () => {
    const recipient = makeRecipient({
      name: 'John Doe',
      address: 'Address 1',
    })

    inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'John Doe',
      address: 'Edited address',
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipient.address).toEqual('Edited address')
  })

  it('should not be allowed to edit a recipient if the user is not admin', async () => {
    const recipient = makeRecipient({
      name: 'John Doe',
      address: 'Address 1',
    })

    inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'John Doe',
      address: 'Edited address',
      role: 'DELIVER_DRIVER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
