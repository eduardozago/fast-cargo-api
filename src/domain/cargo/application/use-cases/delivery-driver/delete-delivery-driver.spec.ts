import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { DeleteDeliveryDriverUseCase } from './delete-delivery-driver'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAdministrator } from 'test/factories/make-administrator'
import { NotAllowedError } from '../errors/not-allowed-error'

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: DeleteDeliveryDriverUseCase

describe('Delete Delivery Driver', () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()

    sut = new DeleteDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it('should be able to delete a delivery driver', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {
        name: 'John Doe',
        password: '123456',
      },
      new UniqueEntityID('driver-01'),
    )

    inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const administrator = makeAdministrator()

    const result = await sut.execute({
      deliveryDriverId: 'driver-01',
      role: administrator.role,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryDriverRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a delivery driver if the user is not an administrator', async () => {
    const deliveryDriver = makeDeliveryDriver(
      {
        name: 'John Doe',
        password: '123456',
      },
      new UniqueEntityID('driver-01'),
    )

    inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      deliveryDriverId: 'driver-01',
      role: deliveryDriver.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
