import { makeDriver } from 'test/factories/make-driver'
import { GetDriverUseCase } from './get-driver'
import { InMemoryDriversRepository } from 'test/respositories/in-memory-drivers-repository'

let inMemoryDriversRepository: InMemoryDriversRepository
let sut: GetDriverUseCase

describe('Get Driver', () => {
  beforeEach(() => {
    inMemoryDriversRepository = new InMemoryDriversRepository()

    sut = new GetDriverUseCase(inMemoryDriversRepository)
  })

  it('should be able to add a driver', async () => {
    const driver = makeDriver()

    inMemoryDriversRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.driver.taxId).toEqual(driver.taxId)
  })
})
