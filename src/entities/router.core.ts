// Written by Ingo Schmidt, in 2024.

import { Router } from './router.abstract'

export class CoreRouter extends Router<Router> {
  public get species(): string {
    return 'core'
  }
}

// EOF
