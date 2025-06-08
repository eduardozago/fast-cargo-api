import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { GetDeliveryDriverUseCase } from './get-delivery-driver'

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: GetDeliveryDriverUseCase

describe('Get Delivery Driver', () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()

    sut = new GetDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it('should be able to add a delivery driver', async () => {
    const deliveryDriver = makeDeliveryDriver()

    inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryDriver.taxId).toEqual(deliveryDriver.taxId)
  })
})
