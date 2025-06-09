import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../../repositories/orders-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { Recipient } from '@/domain/cargo/enterprise/entities/recipient'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '../errors/not-allowed-error'
import { UserRole } from '@/domain/cargo/enterprise/entities/user-role'

interface AddRecipientUseCaseRequest {
  orderId: string
  name: string
  address: string
  role: string
}

type AddRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class AddRecipientUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientRepository: RecipientsRepository,
  ) {}

  async execute({
    orderId,
    name,
    address,
    role,
  }: AddRecipientUseCaseRequest): Promise<AddRecipientUseCaseResponse> {
    const isValidRole = Object.values(UserRole).includes(role as UserRole)

    if (!isValidRole) {
      return left(new NotAllowedError())
    }

    const validRole = role as UserRole

    if (validRole !== UserRole.ADMIN) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const recipient = Recipient.create({
      orderId: new UniqueEntityID(orderId),
      name,
      address,
    })

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
