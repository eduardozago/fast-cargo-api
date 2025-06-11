import { Either, left, right } from '@/core/either'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'
import { NotAllowedError } from '../errors/not-allowed-error'

interface AddDeliveryDriverUseCaseRequest {
  taxId: string
  name: string
  password: string
  role: string
}

type AddDeliveryDriverUseCaseResponse = Either<
  NotAllowedError | ResourceAlreadyExistsError,
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
    role,
  }: AddDeliveryDriverUseCaseRequest): Promise<AddDeliveryDriverUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

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
