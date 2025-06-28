import { InMemoryNotificationsRepository } from 'test/respositories/in-memory-notifications-repository'
import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-id'),
    })

    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      recipientId: 'recipient-id',
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readedAt).toBeTruthy()
  })

  it('should not be able to read a notification from another recipient', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-id'),
    })

    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      recipientId: 'not-allowed-recipient-id',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
