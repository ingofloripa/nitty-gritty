// Written by Ingo Schmidt, in 2024.

import { NetworkInputPort } from 'src/port.input/network'
import { L3SwitchOutputPort } from 'src/port.output'
import { NetworkOutputPort } from 'src/port.output/network'
import { Id, Network } from 'src/value-objects'

export class NetworkUseCase extends NetworkInputPort {
  public constructor(
    private readonly network: NetworkOutputPort,
    private readonly l3switch: L3SwitchOutputPort,
  ) {
    super()
  }

  async addToL3Switch(network: Network, l3switchId: Id): Promise<void> {
    const l3switch = await this.l3switch.retrieve(l3switchId)
    l3switch.addNetwork(network)
    this.network.persist(network, l3switchId)
  }

  async removeFromL3Switch(networkName: string, l3switchId: Id): Promise<void> {
    const l3switch = await this.l3switch.retrieve(l3switchId)
    l3switch.removeNetwork(networkName)
    this.network.delete(networkName, l3switchId)
  }
}

// EOF
