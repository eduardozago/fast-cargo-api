import { Either, left, right } from '@/core/either'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
}

type GetDeliveryDriverUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryDriver: DeliveryDriver
  }
>

export class GetDeliveryDriverUseCase {
  constructor(private deliveryDriverRepository: DeliveryDriverRepository) {}

  async execute({
    deliveryDriverId,
  }: GetDeliveryDriverUseCaseRequest): Promise<GetDeliveryDriverUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriverRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    return right({
      deliveryDriver,
    })
  }
}
