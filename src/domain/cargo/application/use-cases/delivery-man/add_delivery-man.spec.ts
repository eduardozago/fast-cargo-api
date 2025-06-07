import { InMemoryDeliveryMenRepository } from 'test/respositories/in-memory-delivery-men-repository'
import { AddDeliveryManUseCase } from './add-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: AddDeliveryManUseCase

describe('Add Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()

    sut = new AddDeliveryManUseCase(inMemoryDeliveryMenRepository)
  })

  it('should be able to add a delivery man', async () => {
    const deliverMan = makeDeliveryMan()

    const result = await sut.execute({
      taxId: deliverMan.taxId,
      name: deliverMan.name,
      password: deliverMan.password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveryMan.taxId).toEqual(deliverMan.taxId)
    expect(inMemoryDeliveryMenRepository.items[0].taxId).toEqual(
      deliverMan.taxId,
    )
  })
})
