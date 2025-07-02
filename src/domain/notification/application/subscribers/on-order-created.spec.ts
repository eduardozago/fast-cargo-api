import { makeOrder } from 'test/factories/make-order'
import { OnOrderCreated } from './on-order-created'
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

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecutionSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Order Created', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    new OnOrderCreated(inMemoryRecipientsRepository, sendNotificationUseCase)

    sendNotificationExecutionSpy = vi.spyOn(sendNotificationUseCase, 'execute')
  })
  it('should send a notification when an order is created', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({
      recipientId: recipient.id,
    })
    await inMemoryOrdersRepository.create(order)

    await waitFor(() => {
      expect(sendNotificationExecutionSpy).toHaveBeenCalled()
    })
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
