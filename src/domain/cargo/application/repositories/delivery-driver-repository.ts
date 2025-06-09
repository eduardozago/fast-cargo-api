import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'

export abstract class DeliveryDriverRepository {
  abstract findById(id: string): Promise<DeliveryDriver | null>
  abstract findByTaxId(taxId: string): Promise<DeliveryDriver | null>
  abstract findAll(params: PaginationParams): Promise<DeliveryDriver[]>
  abstract create(deliverDriver: DeliveryDriver): Promise<void>
  abstract save(deliverDriver: DeliveryDriver): Promise<void>
  abstract delete(deliverDriver: DeliveryDriver): Promise<void>
}
