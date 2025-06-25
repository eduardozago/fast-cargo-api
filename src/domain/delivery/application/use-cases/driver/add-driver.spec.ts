import { AddDriverUseCase } from './add-driver'
import { makeDriver } from 'test/factories/make-driver'
import { InMemoryDriversRepository } from 'test/respositories/in-memory-drivers-repository'

let inMemoryDriversRepository: InMemoryDriversRepository
let sut: AddDriverUseCase

describe('Add Driver', () => {
  beforeEach(() => {
    inMemoryDriversRepository = new InMemoryDriversRepository()

    sut = new AddDriverUseCase(inMemoryDriversRepository)
  })

  it('should be able to add a driver', async () => {
    const driver = makeDriver()

    const result = await sut.execute({
      accountId: 'account-01',
      name: driver.name,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDriversRepository.items[0].accountId.toString()).toEqual(
      'account-01',
    )
  })
})
