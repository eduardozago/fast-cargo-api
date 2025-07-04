import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DriversRepository } from '../../repositories/drivers-repository'

interface DeleteDriverUseCaseRequest {
  driverId: string
}

type DeleteDriverUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteDriverUseCase {
  constructor(private driverRepository: DriversRepository) {}

  async execute({
    driverId,
  }: DeleteDriverUseCaseRequest): Promise<DeleteDriverUseCaseResponse> {
    const driver = await this.driverRepository.findById(driverId)

    if (!driver) {
      return left(new ResourceNotFoundError())
    }

    await this.driverRepository.delete(driver)

    return right(null)
  }
}
