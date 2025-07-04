import { Either, left, right } from '@/core/either'
import { Driver } from '@/domain/delivery/enterprise/entities/driver'
import { DriversRepository } from '../../repositories/drivers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface EditDriverUseCaseRequest {
  driverId: string
  name: string
}

type EditDriverUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    driver: Driver
  }
>

export class EditDriverUseCase {
  constructor(private driversRepository: DriversRepository) {}

  async execute({
    driverId,
    name,
  }: EditDriverUseCaseRequest): Promise<EditDriverUseCaseResponse> {
    const driver = await this.driversRepository.findById(driverId)

    if (!driver) {
      return left(new ResourceNotFoundError())
    }

    driver.name = name

    await this.driversRepository.save(driver)

    return right({
      driver,
    })
  }
}
