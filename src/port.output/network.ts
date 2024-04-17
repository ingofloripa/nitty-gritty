// Written by Ingo Schmidt, in 2024.

import { Id, Network } from 'src/value-objects'

export abstract class NetworkOutputPort {
  abstract persist(network: Network, l3switchId: Id): Promise<void>
  abstract delete(networkName: string, l3switchId: Id): Promise<void>
}

// EOF
