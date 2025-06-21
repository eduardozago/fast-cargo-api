import { makeDriver } from 'test/factories/make-driver'
import { FetchDriversUseCase } from './fetch-drivers'
import { InMemoryDriversRepository } from 'test/respositories/in-memory-drivers-repository'

let inMemoryDriversRepository: InMemoryDriversRepository
let sut: FetchDriversUseCase

describe('Fetch Drivers', () => {
  beforeEach(() => {
    inMemoryDriversRepository = new InMemoryDriversRepository()

    sut = new FetchDriversUseCase(inMemoryDriversRepository)
  })

  it('should be able to fetch drivers', async () => {
    inMemoryDriversRepository.create(makeDriver())
    inMemoryDriversRepository.create(makeDriver())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.drivers).toHaveLength(2)
  })

  it('should be able to fetch paginated drivers', async () => {
    for (let i = 0; i < 12; i++) {
      inMemoryDriversRepository.create(makeDriver())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.drivers).toHaveLength(2)
  })
})
