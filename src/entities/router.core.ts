// Written by Ingo Schmidt, in 2024.

import { ConflictError } from 'src/errors'
import { Device } from './device'
import { Router } from './router.abstract'
import { EdgeRouter } from './router.edge'

export class CoreRouter extends Router<Router> {
  public override linkDevice(device: Router<Device>): void {
    if (device instanceof EdgeRouter && this.country !== device.country) {
      throw new ConflictError('unable to link an edge router from another country')
    }
    super.linkDevice(device)
  }

  public get species(): string {
    return 'core'
  }

  protected isDeviceLinkable(device: Router): boolean {
    return device instanceof Router
  }
}

// EOF
