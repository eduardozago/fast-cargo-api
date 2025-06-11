import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { EditDeliveryDriverUseCase } from './edit-delivery-driver'
import { makeAdministrator } from 'test/factories/make-administrator'
import { NotAllowedError } from '../errors/not-allowed-error'

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

    const administrator = makeAdministrator()

    inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
      name: 'John Doe',
      password: '123123',
      role: administrator.role,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryDriver.password).toEqual('123123')
  })

  it('should not be able to edit a delivery driver if the use is not an administrator', async () => {
    const deliveryDriver = makeDeliveryDriver({
      name: 'John Doe',
      password: '123456',
    })

    inMemoryDeliveryDriverRepository.create(deliveryDriver)

    const result = await sut.execute({
      deliveryDriverId: deliveryDriver.id.toString(),
      name: 'John Doe',
      password: '123123',
      role: deliveryDriver.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
