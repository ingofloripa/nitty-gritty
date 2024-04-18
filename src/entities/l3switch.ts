// Written by Ingo Schmidt, in 2024.

import { ConflictError, InternalServerError } from 'src/errors'
import { Network } from 'src/value-objects'
import { Device } from './device'

export class L3Switch extends Device {
  // #TRICK: late initialization required for entity rehidration from the output port
  public setNetworks(networks: Network[]): void {
    const _networks = new Map() as Map<string, Network>
    for (const network of networks) {
      _networks.set(network.name, network)
      if (_networks.size === this.numOfPorts) {
        break
      }
    }
    this.networks = _networks
  }

  public getNetworks(): Network[] {
    this.assertIsNotShallowInstance()
    return Array.from(this.networks.values())
  }

  public addNetwork(network: Network): void {
    this.assertIsNotShallowInstance()
    if (this.networks.has(network.name)) {
      throw new ConflictError('network already exists')
    }
    if (this.isAllPortsUsed()) {
      throw new ConflictError('unable to add another network (no ports available)')
    }
    this.networks.set(network.name, network)
  }

  public removeNetwork(network: Network): void {
    this.assertIsNotShallowInstance()
    if (this.networks === undefined || !this.networks.has(network.name)) {
      throw new ConflictError('network already added')
    }
    this.networks.delete(network.name)
  }

  public isAllPortsAvailable(): boolean {
    this.assertIsNotShallowInstance()
    return this.networks.size === 0
  }

  public isAllPortsUsed(): boolean {
    this.assertIsNotShallowInstance()
    return this.networks?.size === this.numOfPorts
  }

  public get genus(): string {
    return 'switch'
  }

  public get species(): string {
    return 'l3'
  }

  private assertIsNotShallowInstance(): void {
    if (this.networks === undefined) {
      throw new InternalServerError({
        message: 'Panic (shallow layer 3 switch instance)',
        routerId: String(this.id),
      })
    }
  }

  private networks: Map<string, Network>
}

// EOF
