import { InMemoryDriversRepository } from 'test/respositories/in-memory-drivers-repository'
import { makeDriver } from 'test/factories/make-driver'
import { DeleteDriverUseCase } from './delete-driver'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryDriversRepository: InMemoryDriversRepository
let sut: DeleteDriverUseCase

describe('Delete Driver', () => {
  beforeEach(() => {
    inMemoryDriversRepository = new InMemoryDriversRepository()

    sut = new DeleteDriverUseCase(inMemoryDriversRepository)
  })

  it('should be able to delete a driver', async () => {
    const driver = makeDriver(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('driver-01'),
    )

    inMemoryDriversRepository.create(driver)

    const result = await sut.execute({
      driverId: 'driver-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDriversRepository.items.length).toEqual(0)
  })
})
