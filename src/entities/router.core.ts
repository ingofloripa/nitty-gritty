// Written by Ingo Schmidt, in 2024.

import { Router } from './router.abstract'

export class CoreRouter extends Router<Router> {
  public readonly type: string = 'router'
  public readonly subType: string = 'core'

  public isDeviceLinkable(device: Router): boolean {
    return device instanceof Router
  }
}

// EOF
