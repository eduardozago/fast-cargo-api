import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import { FetchRecipientsUseCase } from './fetch-recipients'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new FetchRecipientsUseCase(inMemoryRecipientRepository)
  })

  it('should be able to fetch recipients', async () => {
    inMemoryRecipientRepository.create(makeRecipient())
    inMemoryRecipientRepository.create(makeRecipient())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipients).toHaveLength(2)
  })

  it('should be able to fetch paginated recipients', async () => {
    for (let i = 0; i < 12; i++) {
      inMemoryRecipientRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.recipients).toHaveLength(2)
  })
})
