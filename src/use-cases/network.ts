// Written by Ingo Schmidt, in 2024.

import { NetworkInputPort } from 'src/port.input/network'
import { NetworkOutputPort } from 'src/port.output/network'
import { Id, Network } from 'src/value-objects'

export class NetworkUseCase extends NetworkInputPort {
  public constructor(private readonly network: NetworkOutputPort) {
    super()
  }

  async addToL3Switch(network: Network, l3switchId: Id): Promise<void> {
    this.network.persist(network, l3switchId)
  }

  async removeFromL3Switch(networkName: string, l3switchId: Id): Promise<void> {
    this.network.delete(networkName, l3switchId)
  }
}

// EOF
