import { DeliveryDriver } from '../../enterprise/entities/delivery-driver'

export abstract class DeliveryDriverRepository {
  abstract findById(id: string): Promise<DeliveryDriver | null>
  abstract findByTaxId(taxId: string): Promise<DeliveryDriver | null>
  abstract create(deliverDriver: DeliveryDriver): Promise<void>
}
