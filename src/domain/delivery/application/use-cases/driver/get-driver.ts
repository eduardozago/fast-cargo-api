import { Either, left, right } from '@/core/either'
import { Driver } from '@/domain/delivery/enterprise/entities/driver'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DriversRepository } from '../../repositories/drivers-repository'

interface GetDriverUseCaseRequest {
  driverId: string
}

type GetDriverUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    driver: Driver
  }
>

export class GetDriverUseCase {
  constructor(private driverRepository: DriversRepository) {}

  async execute({
    driverId,
  }: GetDriverUseCaseRequest): Promise<GetDriverUseCaseResponse> {
    const driver = await this.driverRepository.findById(driverId)

    if (!driver) {
      return left(new ResourceNotFoundError())
    }

    return right({
      driver,
    })
  }
}
