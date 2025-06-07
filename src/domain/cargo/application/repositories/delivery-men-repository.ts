import { DeliveryMan } from '../../enterprise/entities/delivery-man'

export abstract class DeliveryMenRepository {
  abstract create(deliverMan: DeliveryMan): Promise<void>
}
