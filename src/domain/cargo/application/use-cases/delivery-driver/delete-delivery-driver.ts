import { Either, left, right } from '@/core/either'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { NotAllowedError } from '../errors/not-allowed-error'

interface DeleteDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
  role: string
}

type DeleteDeliveryDriverUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteDeliveryDriverUseCase {
  constructor(private deliveryDriverRepository: DeliveryDriverRepository) {}

  async execute({
    deliveryDriverId,
    role,
  }: DeleteDeliveryDriverUseCaseRequest): Promise<DeleteDeliveryDriverUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

    const deliveryDriver =
      await this.deliveryDriverRepository.findById(deliveryDriverId)

    if (!deliveryDriver) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryDriverRepository.delete(deliveryDriver)

    return right(null)
  }
}
