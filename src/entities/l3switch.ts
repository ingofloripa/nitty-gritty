// Written by Ingo Schmidt, in 2024.

import {
  NetworkExistsRule,
  NetworkIpIsAvailableRule,
  NetworkNameIsAvailableRule,
  PortIsAvailableRule,
} from 'src/rules'
import { Description, Id, Ip4, Location, Network } from 'src/value-objects'
import { Device } from './device'

export class L3Switch extends Device {
  public constructor(
    id: Id,
    description: Description,
    ip: Ip4,
    location: Location,
    numOfPorts: number,
    networks: Network[],
  ) {
    super(id, description, ip, location, numOfPorts)
    networks.forEach(this.addNetwork.bind(this))
  }

  public getNetworks(): Network[] {
    return Array.from(this.networks.values())
  }

  public addNetwork(network: Network): void {
    new NetworkNameIsAvailableRule(this, network.name).passOrThrow()
    new NetworkIpIsAvailableRule(this, network.ip).passOrThrow()
    new PortIsAvailableRule(this).passOrThrow()
    this.networks.set(network.name, network)
  }

  public removeNetwork(networkName: string): void {
    new NetworkExistsRule(this, networkName).passOrThrow()
    this.networks.delete(networkName)
  }

  public get numOfPortsUsed(): number {
    return this.networks.size
  }

  public get genus(): string {
    return 'switch'
  }

  public get species(): string {
    return 'l3'
  }

  private readonly networks = new Map<string, Network>()
}

// EOF
