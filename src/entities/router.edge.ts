// Written by Ingo Schmidt, in 2024.

import { Router } from './router.abstract'
import { L3Switch } from './l3switch'

export class EdgeRouter extends Router<L3Switch> {
  public readonly type: string = 'router'
  public readonly subType: string = 'edge'

  public isDeviceLinkable(device: L3Switch): boolean {
    return device instanceof L3Switch
  }
}

// EOF
