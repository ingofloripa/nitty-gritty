// Written by Ingo Schmidt, in 2024.

import { BadRequestError } from 'src/errors'
import { Ip4 } from './ip4'

export class Network {
  public readonly name: string
  public readonly ip: Ip4
  public readonly cidr: number

  public constructor(name: string, ip: Ip4, cidr: number) {
    if (name.length === 0) {
      throw new BadRequestError('invalid network (empty name)')
    }
    if (name.length > 128) {
      throw new BadRequestError('invalid network (name too long)')
    }
    this.name = name
    this.ip = ip
    if (!Number.isInteger(cidr) || cidr < 8 || cidr > 31) {
      throw new BadRequestError('invalid network (CIDR out of range)')
    }
    this.cidr = cidr
  }

  public isEqual(network: Network): boolean {
    return (
      network.name === this.name ||
      (network.ip.isEqual(this.ip) && network.cidr === this.cidr)
    )
  }

  public toString(): string {
    return `${this.name}@${this.ip}/${this.cidr}`
  }
}

// EOF
