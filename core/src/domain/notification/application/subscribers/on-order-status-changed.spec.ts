import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/respositories/in-memory-orders-repository'
import { InMemoryRecipientRepository } from 'test/respositories/in-memory-recipients-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/respositories/in-memory-notifications-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { OnOrderStatusChanged } from './on-order-status-changed'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecutionSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Order Status Changed', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    new OnOrderStatusChanged(
      inMemoryRecipientsRepository,
      sendNotificationUseCase,
    )

    sendNotificationExecutionSpy = vi.spyOn(sendNotificationUseCase, 'execute')
  })
  it('should send a notification when an order status changed', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })
    await inMemoryOrdersRepository.create(order)

    order.status = OrderStatus.AVAILABLE
    await inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecutionSpy).toHaveBeenCalled()
    })
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
