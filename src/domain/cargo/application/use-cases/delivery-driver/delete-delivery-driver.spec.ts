import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { DeleteDeliveryDriverUseCase } from './delete-delivery-driver'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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

    const result = await sut.execute({
      deliveryDriverId: 'driver-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryDriverRepository.items.length).toEqual(0)
  })
})
