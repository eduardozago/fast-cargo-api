import { PaginationParams } from '@/core/repositories/pagination-params'
import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract findAll(params: PaginationParams): Promise<Recipient[]>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
