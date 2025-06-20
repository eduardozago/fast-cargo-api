import { PaginationParams } from '@/core/repositories/pagination-params'
import { DriversRepository } from '@/domain/delivery/application/repositories/drivers-repository'
import { Driver } from '@/domain/delivery/enterprise/entities/driver'

export class InMemoryDriversRepository extends DriversRepository {
  public items: Driver[] = []

  async findById(id: string): Promise<Driver | null> {
    const deliverDriver = this.items.find((item) => item.id.toString() === id)

    if (!deliverDriver) {
      return null
    }

    return deliverDriver
  }

  async findAll({ page }: PaginationParams): Promise<Driver[]> {
    const deliverDrivers = this.items.slice((page - 1) * 10, page * 10)

    return deliverDrivers
  }

  async create(deliverDriver: Driver) {
    this.items.push(deliverDriver)
  }

  async save(deliverDriver: Driver): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliverDriver.id,
    )

    this.items[itemIndex] = deliverDriver
  }

  async delete(deliverDriver: Driver): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliverDriver.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
