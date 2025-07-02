import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { OrderCreatedEvent } from '@/domain/delivery/enterprise/events/order-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderCreated implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderCreatedNotification.bind(this) as (event: unknown) => void,
      OrderCreatedEvent.name,
    )
  }

  private async sendOrderCreatedNotification({ order }: OrderCreatedEvent) {
    const recipient = await this.recipientsRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'New Delivery Order',
        content:
          'A new delivery order has been created for you. It will be available for assignment soon.',
      })
    }
  }
}
