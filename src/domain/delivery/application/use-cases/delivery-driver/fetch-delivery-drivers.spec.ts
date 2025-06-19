import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { FetchDeliveryDriversUseCase } from './fetch-delivery-drivers'

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: FetchDeliveryDriversUseCase

describe('Fetch Delivery Drivers', () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()

    sut = new FetchDeliveryDriversUseCase(inMemoryDeliveryDriverRepository)
  })

  it('should be able to fetch delivery drivers', async () => {
    inMemoryDeliveryDriverRepository.create(makeDeliveryDriver())
    inMemoryDeliveryDriverRepository.create(makeDeliveryDriver())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryDrivers).toHaveLength(2)
  })

  it('should be able to fetch paginated delivery drivers', async () => {
    for (let i = 0; i < 12; i++) {
      inMemoryDeliveryDriverRepository.create(makeDeliveryDriver())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryDrivers).toHaveLength(2)
  })
})
