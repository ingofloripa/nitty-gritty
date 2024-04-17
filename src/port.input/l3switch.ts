// Written by Ingo Schmidt, in 2024.

import { L3Switch } from 'src/entities'
import { Description, Id, Ip4, Location } from 'src/value-objects'

export type CreateL3SwitchArgs = {
  description: Description
  ip: Ip4
  location: Location
  numOfPorts: number
}

export abstract class L3SwitchInputPort {
  abstract listAll(): Promise<Id[]>
  abstract retrieve(id: Id): Promise<L3Switch>
  abstract create(args: CreateL3SwitchArgs): Promise<L3Switch>
  abstract linkToEdgeRouter(switchId: Id, edgeRouterId: Id): Promise<void>
  abstract unlinkFromEdgeRouter(switchId: Id, edgeRouterId: Id): Promise<void>
  abstract delete(id: Id): Promise<void>
}

// EOF
