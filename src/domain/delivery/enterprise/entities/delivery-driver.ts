import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from './user-role'
import { Optional } from '@/core/types/optional'

export interface DeliveryDriverProps {
  orderId?: UniqueEntityID
  taxId: string
  name: string
  password: string
  role: UserRole
}

export class DeliveryDriver extends Entity<DeliveryDriverProps> {
  get orderId() {
    return this.props.orderId
  }

  get taxId() {
    return this.props.taxId
  }

  get name() {
    return this.props.name
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  set name(name: string) {
    this.props.name = name
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(
    props: Optional<DeliveryDriverProps, 'role'>,
    id?: UniqueEntityID,
  ) {
    const deliverDriver = new DeliveryDriver(
      {
        ...props,
        role: props.role ?? UserRole.DELIVERY_DRIVER,
      },
      id,
    )

    return deliverDriver
  }
}
