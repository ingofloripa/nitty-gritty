// Written by Ingo Schmidt, in 2024.

import { Router } from 'src/entities'
import { Description, Id, Ip4, Location } from 'src/value-objects'

export type CreateRouterArgs = {
  type: string
  description: Description
  ip: Ip4
  location: Location
  numOfPorts: number
}

export abstract class RouterInputPort {
  abstract listAll(): Promise<Id[]>
  abstract retrieve(id: Id): Promise<Router>
  abstract create(args: CreateRouterArgs): Promise<Router>
  abstract linkToCoreRouter(routerId: Id, coreRouterId: Id): Promise<void>
  abstract unlinkFromCoreRouter(routerId: Id, coreRouterId: Id): Promise<void>
  abstract delete(id: Id): Promise<void>
}

// EOF
