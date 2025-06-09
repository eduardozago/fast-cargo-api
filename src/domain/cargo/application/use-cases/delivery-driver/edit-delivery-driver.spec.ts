import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { EditDeliveryDriverUseCase } from './edit-delivery-driver'

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: EditDeliveryDriverUseCase

describe('Edit Delivery Driver', () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()

    sut = new EditDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it('should be able to edit a delivery driver', async () => {
    const deliveryDriver = makeDeliveryDriver({
      name: 'John Doe',
      password: '123456',
    })

    inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
      name: 'John Doe',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryDriver.password).toEqual('123123')
  })
})
