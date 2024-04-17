// Written by Ingo Schmidt, in 2024.

import { Id, Network } from 'src/value-objects'

export abstract class NetworkInputPort {
  abstract addToL3Switch(network: Network, l3switchId: Id): Promise<void>
  abstract removeFromL3Switch(networkName: string, l3switchId: Id): Promise<void>
}

// EOF
