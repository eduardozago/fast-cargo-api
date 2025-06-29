import { InMemoryNotificationsRepository } from 'test/respositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const notification = makeNotification()

    const result = await sut.execute({
      recipientId: 'recipient-id',
      title: notification.title,
      content: notification.content,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityID('recipient-id'),
      }),
    )
  })
})
