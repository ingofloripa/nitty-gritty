// Written by Ingo Schmidt, in 2024.

import { Device } from 'src/entities'
import { ConflictError } from 'src/errors'
import { AbstractRule } from './abstract'

export class PortIsAvaliableRule extends AbstractRule {
  public constructor(private readonly device: Device) {
    super()
  }

  public isSatisfied(): boolean {
    return this.device.numOfPortsUsed < this.device.numOfPorts
  }

  protected createError(): Error {
    throw new ConflictError('device has no ports available', { id: String(this.device) })
  }
}

export class AllPortsAreAvaliableRule extends AbstractRule {
  public constructor(private readonly device: Device) {
    super()
  }

  public isSatisfied(): boolean {
    return this.device.numOfPortsUsed === 0
  }

  protected createError(): Error {
    throw new ConflictError('device has ports in use', { id: String(this.device.id) })
  }
}

export class IpIsDifferentRule extends AbstractRule {
  public constructor(
    private readonly a: Device,
    private readonly b: Device,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return !this.a.ip.isEqual(this.b.ip)
  }

  protected createError(): Error {
    throw new ConflictError('both devices have the same IP', {
      id: [String(this.a.id), String(this.b.id)],
      ip: String(this.a.ip),
    })
  }
}

// EOF
