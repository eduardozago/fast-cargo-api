import { Either, left, right } from '@/core/either'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface EditDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
  name: string
  password: string
}

type EditDeliveryDriverUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class EditDeliveryDriverUseCase {
  constructor(private deliveryDriverRepository: DeliveryDriverRepository) {}

  async execute({
    deliveryDriverId,
    name,
    password,
  }: EditDeliveryDriverUseCaseRequest): Promise<EditDeliveryDriverUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriverRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    deliveryDriver.name = name
    deliveryDriver.password = password

    await this.deliveryDriverRepository.save(deliveryDriver)

    return right({
      deliveryDriver,
    })
  }
}
