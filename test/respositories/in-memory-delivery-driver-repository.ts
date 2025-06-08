import { DeliveryDriverRepository } from '@/domain/cargo/application/repositories/delivery-driver-repository'
import { DeliveryDriver } from '@/domain/cargo/enterprise/entities/delivery-driver'

export class InMemoryDeliveryDriverRepository extends DeliveryDriverRepository {
  public items: DeliveryDriver[] = []

  async findById(id: string): Promise<DeliveryDriver | null> {
    const deliverDriver = this.items.find((item) => item.id.toString() === id)

    if (!deliverDriver) {
      return null
    }

    return deliverDriver
  }

  async findByTaxId(taxId: string): Promise<DeliveryDriver | null> {
    const deliverDriver = this.items.find((item) => item.taxId === taxId)

    if (!deliverDriver) {
      return null
    }

    return deliverDriver
  }

  async create(deliverDriver: DeliveryDriver) {
    this.items.push(deliverDriver)
  }

  async save(deliverDriver: DeliveryDriver): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliverDriver.id,
    )

    this.items[itemIndex] = deliverDriver
  }

  async delete(deliverDriver: DeliveryDriver): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliverDriver.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
