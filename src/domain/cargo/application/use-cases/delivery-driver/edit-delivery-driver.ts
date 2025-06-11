import { Either, left, right } from '@/core/either'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { NotAllowedError } from '../errors/not-allowed-error'

interface EditDeliveryDriverUseCaseRequest {
  deliveryDriverId: string
  name: string
  password: string
  role: string
}

type EditDeliveryDriverUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
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
    role,
  }: EditDeliveryDriverUseCaseRequest): Promise<EditDeliveryDriverUseCaseResponse> {
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

    deliveryDriver.name = name
    deliveryDriver.password = password

    await this.deliveryDriverRepository.save(deliveryDriver)

    return right({
      deliveryDriver,
    })
  }
}
