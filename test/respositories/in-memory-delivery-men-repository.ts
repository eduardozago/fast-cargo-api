import { DeliveryMenRepository } from '@/domain/cargo/application/repositories/delivery-men-repository'
import { DeliveryMan } from '@/domain/cargo/enterprise/entities/delivery-man'

export class InMemoryDeliveryMenRepository extends DeliveryMenRepository {
  public items: DeliveryMan[] = []

  async create(deliverMan: DeliveryMan) {
    this.items.push(deliverMan)
  }
}
