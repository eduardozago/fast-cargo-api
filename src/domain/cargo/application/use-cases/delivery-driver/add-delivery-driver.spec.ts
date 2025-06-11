import { InMemoryDeliveryDriverRepository } from 'test/respositories/in-memory-delivery-driver-repository'
import { AddDeliveryDriverUseCase } from './add-delivery-driver'
import { makeDeliveryDriver } from 'test/factories/make-delivery-driver'
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error'
import { makeAdministrator } from 'test/factories/make-administrator'
import { NotAllowedError } from '../errors/not-allowed-error'

let inMemoryDeliveryDriverRepository: InMemoryDeliveryDriverRepository
let sut: AddDeliveryDriverUseCase

describe('Add Delivery Driver', () => {
  beforeEach(() => {
    inMemoryDeliveryDriverRepository = new InMemoryDeliveryDriverRepository()

    sut = new AddDeliveryDriverUseCase(inMemoryDeliveryDriverRepository)
  })

  it('should be able to add a delivery driver', async () => {
    const deliverDriver = makeDeliveryDriver()

    const administrator = makeAdministrator()

    const result = await sut.execute({
      taxId: deliverDriver.taxId,
      name: deliverDriver.name,
      password: deliverDriver.password,
      role: administrator.role,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryDriver.taxId).toEqual(deliverDriver.taxId)
    expect(inMemoryDeliveryDriverRepository.items[0].taxId).toEqual(
      deliverDriver.taxId,
    )
  })

  it('should not be able to add a delivery driver with same tax id', async () => {
    const deliverDriver = makeDeliveryDriver()

    const administrator = makeAdministrator()

    inMemoryDeliveryDriverRepository.create(deliverDriver)

    const result = await sut.execute({
      taxId: deliverDriver.taxId,
      name: deliverDriver.name,
      password: deliverDriver.password,
      role: administrator.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not be able to add a delivery driver if the user is not an administrator', async () => {
    const deliverDriver = makeDeliveryDriver()

    inMemoryDeliveryDriverRepository.create(deliverDriver)

    const result = await sut.execute({
      taxId: deliverDriver.taxId,
      name: deliverDriver.name,
      password: deliverDriver.password,
      role: deliverDriver.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
