import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order'
import { OrderStatusChangedEvent } from '@/domain/delivery/enterprise/events/order-status-changed-event'

export class OnOrderStatusChanged implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderStatusChangedNotification.bind(this) as (
        event: unknown,
      ) => void,
      OrderStatusChangedEvent.name,
    )
  }

  private async sendOrderStatusChangedNotification({
    order,
  }: OrderStatusChangedEvent) {
    const recipient = await this.recipientsRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      switch (order.status) {
        case OrderStatus.AVAILABLE: {
          await this.sendNotification.execute({
            recipientId: recipient.id.toString(),
            title: 'Your Delivery Is Being Processed',
            content:
              "Your delivery is now in the queue to be picked up. We’ll notify you once it's on the way.",
          })

          break
        }

        case OrderStatus.PICKED_UP: {
          await this.sendNotification.execute({
            recipientId: recipient.id.toString(),
            title: 'Your Delivery Is on the Way',
            content:
              'Your package has been picked up and is on its way to you. Be ready to receive it soon!',
          })

          break
        }

        case OrderStatus.DELIVERED: {
          await this.sendNotification.execute({
            recipientId: recipient.id.toString(),
            title: 'Delivery Completed',
            content:
              'Your package has been successfully delivered. We hope everything arrived as expected!',
          })

          break
        }

        case OrderStatus.RETURNED: {
          await this.sendNotification.execute({
            recipientId: recipient.id.toString(),
            title: 'Delivery Returned',
            content:
              'Your delivery could not be completed and was returned. Please contact support for more details.',
          })

          break
        }
      }
    }
  }
}
