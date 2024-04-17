// Written by Ingo Schmidt, in 2024.

import { Router } from 'src/entities'
import { Id } from 'src/value-objects'

export abstract class RouterOutputPort {
  abstract listAll(): Promise<Id[]>
  abstract retrieve(id: Id): Promise<Router>
  abstract persist(router: Router): Promise<void>
  abstract delete(id: Id): Promise<void>
}

// EOF
