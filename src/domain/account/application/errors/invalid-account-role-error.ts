import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAccountRoleError extends Error implements UseCaseError {
  constructor() {
    super('The provided account role is not allowed')
  }
}
