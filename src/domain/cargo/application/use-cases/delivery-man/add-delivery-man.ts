import { Either, right } from '@/core/either'
import { DeliveryMan } from '@/domain/cargo/enterprise/entities/delivery-man'
import { DeliveryMenRepository } from '../../repositories/delivery-men-repository'

interface AddDeliveryManUseCaseRequest {
  taxId: string
  name: string
  password: string
}

type AddDeliveryManUseCaseResponse = Either<
  null,
  {
    deliveryMan: DeliveryMan
  }
>

export class AddDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    taxId,
    name,
    password,
  }: AddDeliveryManUseCaseRequest): Promise<AddDeliveryManUseCaseResponse> {
    const deliveryMan = DeliveryMan.create({
      taxId,
      name,
      password,
    })

    await this.deliveryMenRepository.create(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}
