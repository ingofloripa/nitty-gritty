// Written by Ingo Schmidt, in 2024.

import { L3Switch } from 'src/entities'
import { Id } from 'src/value-objects'

export abstract class L3SwitchOutputPort {
  abstract listAll(): Promise<Id[]>
  abstract retrieve(id: Id): Promise<L3Switch>
  abstract persist(l3Switch: L3Switch): Promise<void>
  abstract delete(id: Id): Promise<void>
}

// EOF
