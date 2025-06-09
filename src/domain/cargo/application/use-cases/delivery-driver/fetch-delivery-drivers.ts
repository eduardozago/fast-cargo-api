import { Either, right } from '@/core/either'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'
import { DeliveryDriverRepository } from '../../repositories/delivery-driver-repository'

interface FetchDeliveryDriversUseCaseRequest {
  page: number
}

type FetchDeliveryDriversUseCaseResponse = Either<
  null,
  {
    deliveryDrivers: DeliveryDriver[]
  }
>

export class FetchDeliveryDriversUseCase {
  constructor(private deliveryDriverRepository: DeliveryDriverRepository) {}

  async execute({
    page,
  }: FetchDeliveryDriversUseCaseRequest): Promise<FetchDeliveryDriversUseCaseResponse> {
    const deliveryDrivers = await this.deliveryDriverRepository.findAll({
      page,
    })

    return right({
      deliveryDrivers,
    })
  }
}
