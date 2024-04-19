// Written by Ingo Schmidt, in 2024.

import { CoreRouter, Device, EdgeRouter, L3Switch, Router } from 'src/entities'
import { AbstractRule } from './abstract'
import { ConflictError } from 'src/errors'

export class DeviceIsNotLinkedRule extends AbstractRule {
  public constructor(
    private readonly router: Router,
    private readonly device: Device,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return !this.router.getLinkedDevices().some((id) => id.isEqual(this.device.id))
  }

  protected createError(): Error {
    throw new ConflictError('device already linked')
  }
}

export class DeviceIsLinkedRule extends AbstractRule {
  public constructor(
    private readonly router: Router,
    private readonly device: Device,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return this.router.getLinkedDevices().some((id) => id.isEqual(this.device.id))
  }

  protected createError(): Error {
    throw new ConflictError('device already unlinked')
  }
}

export class DeviceIsLinkableRule extends AbstractRule {
  public constructor(
    private readonly router: Router,
    private readonly device: Device,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return (
      (this.router instanceof CoreRouter && this.device instanceof Router) ||
      (this.router instanceof EdgeRouter && this.device instanceof L3Switch)
    )
  }

  protected createError(): Error {
    throw new ConflictError('device already linked')
  }
}

export class DeviceIsAtSuitableCountryRule extends AbstractRule {
  public constructor(
    private readonly router: Router,
    private readonly device: Device,
  ) {
    super()
  }

  public isSatisfied(): boolean {
    return (
      this.device instanceof CoreRouter ||
      (this.device instanceof EdgeRouter && this.device.country === this.router.country)
    )
  }

  protected createError(): Error {
    throw new ConflictError('device from another country')
  }
}

// EOF
