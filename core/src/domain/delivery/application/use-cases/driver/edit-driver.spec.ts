import { InMemoryDriversRepository } from 'test/respositories/in-memory-drivers-repository'
import { makeDriver } from 'test/factories/make-driver'
import { EditDriverUseCase } from './edit-driver'

let inMemoryDriversRepository: InMemoryDriversRepository
let sut: EditDriverUseCase

describe('Edit Delivery Driver', () => {
  beforeEach(() => {
    inMemoryDriversRepository = new InMemoryDriversRepository()

    sut = new EditDriverUseCase(inMemoryDriversRepository)
  })

  it('should be able to edit a delivery driver', async () => {
    const driver = makeDriver({
      name: 'John',
    })

    inMemoryDriversRepository.create(driver)

    const result = await sut.execute({
      driverId: driver.id.toString(),
      name: 'John Doe',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.driver.name).toEqual('John Doe')
  })
})
