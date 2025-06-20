import { Either, right } from '@/core/either'
import { Driver } from '@/domain/delivery/enterprise/entities/driver'
import { DriversRepository } from '../../repositories/drivers-repository'
import { ResourceAlreadyExistsError } from '@/core/errors/errors/resource-already-exists-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AddDriverUseCaseRequest {
  accountId: string
  name: string
}

type AddDriverUseCaseResponse = Either<
  NotAllowedError | ResourceAlreadyExistsError,
  {
    driver: Driver
  }
>

export class AddDriverUseCase {
  constructor(private driversRepository: DriversRepository) {}

  async execute({
    accountId,
    name,
  }: AddDriverUseCaseRequest): Promise<AddDriverUseCaseResponse> {
    const driver = Driver.create({
      accountId: new UniqueEntityID(accountId),
      name,
    })

    await this.driversRepository.create(driver)

    return right({
      driver,
    })
  }
}
