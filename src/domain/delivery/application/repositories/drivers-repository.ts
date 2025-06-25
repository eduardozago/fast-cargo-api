import { PaginationParams } from '@/core/repositories/pagination-params'
import { Driver } from '../../enterprise/entities/driver'

export abstract class DriversRepository {
  abstract findById(id: string): Promise<Driver | null>
  abstract findAll(params: PaginationParams): Promise<Driver[]>
  abstract create(deliverDriver: Driver): Promise<void>
  abstract save(deliverDriver: Driver): Promise<void>
  abstract delete(deliverDriver: Driver): Promise<void>
}
