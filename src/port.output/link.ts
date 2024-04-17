// Written by Ingo Schmidt, in 2024.

import { Id } from 'src/value-objects'

export type Link = {
  parentDeviceId: Id
  childDeviceId: Id
}

export abstract class LinkOutputPort {
  abstract create(args: Link): Promise<void>
  abstract remove(args: Link): Promise<void>
}

// EOF
