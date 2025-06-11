import { OrdersRepository } from '@/domain/cargo/application/repositories/orders-repository'
import { Order } from '@/domain/cargo/enterprise/entities/order'

export class InMemoryOrdersRepository extends OrdersRepository {
  public items: Order[] = []

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }
}
