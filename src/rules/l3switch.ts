// Written by Ingo Schmidt, in 2024.

import { L3Switch } from 'src/entities'
import { ConflictError, NotFoundError } from 'src/errors'
import { Ip4 } from 'src/value-objects'
import { AbstractRule } from './abstract'

export class NetworkNameIsAvailableRule extends AbstractRule {
  public constructor(
    private readonly l3switch: L3Switch,
    private readonly networkName: string,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return !this.l3switch.getNetworks().some(({ name }) => name === this.networkName)
  }

  protected createError(): Error {
    return new ConflictError('network name already used')
  }
}

export class NetworkIpIsAvailableRule extends AbstractRule {
  public constructor(
    private readonly l3switch: L3Switch,
    private readonly networkIp: Ip4,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return !this.l3switch.getNetworks().some(({ ip }) => ip.isEqual(this.networkIp))
  }

  protected createError(): Error {
    throw new ConflictError("switch's network IP already used", {
      id: String(this.l3switch.id),
      ip: String(this.networkIp),
    })
  }
}

export class NetworkExistsRule extends AbstractRule {
  public constructor(
    private readonly l3switch: L3Switch,
    private readonly networkName: string,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return this.l3switch.getNetworks().some(({ name }) => name === this.networkName)
  }

  protected createError(): Error {
    throw new NotFoundError('switch network not found', {
      id: String(this.l3switch.id),
      network: String(this.networkName),
    })
  }
}

// EOF
