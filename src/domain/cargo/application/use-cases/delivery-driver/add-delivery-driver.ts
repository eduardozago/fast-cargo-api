import { Either, left, right } from '@/core/either'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error'

interface AddDeliveryDriverUseCaseRequest {
  taxId: string
  name: string
  password: string
}

type AddDeliveryDriverUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class AddDeliveryDriverUseCase {
  constructor(private deliveryDriverRepository: DeliveryDriverRepository) {}

  async execute({
    taxId,
    name,
    password,
  }: AddDeliveryDriverUseCaseRequest): Promise<AddDeliveryDriverUseCaseResponse> {
    const deliveryDriverAlreadyExists =
      await this.deliveryDriverRepository.findByTaxId(taxId)

    if (deliveryDriverAlreadyExists) {
      return left(new ResourceAlreadyExistsError())
    }

    const deliveryDriver = DeliveryDriver.create({
      taxId,
      name,
      password,
    })

    await this.deliveryDriverRepository.create(deliveryDriver)

    return right({
      deliveryDriver,
    })
  }
}
