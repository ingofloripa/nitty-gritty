// Written by Ingo Schmidt, in 2024.

import { Router } from './router.abstract'
import { L3Switch } from './l3switch'

export class EdgeRouter extends Router<L3Switch> {
  public get species(): string {
    return 'edge'
  }
}

// EOF
