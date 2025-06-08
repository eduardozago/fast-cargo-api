import { Either, left, right } from '@/core/either'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
}

type DeleteDeliveryDriverUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteDeliveryDriverUseCase {
  constructor(private deliveryDriverRepository: DeliveryDriverRepository) {}

  async execute({
    deliveryDriverId,
  }: DeleteDeliveryDriverUseCaseRequest): Promise<DeleteDeliveryDriverUseCaseResponse> {
    const deliveryDriver =
      await this.deliveryDriverRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryDriverRepository.delete(deliveryDriver)

    return right(null)
  }
}
