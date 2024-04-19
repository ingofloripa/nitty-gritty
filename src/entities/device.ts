// Written by Ingo Schmidt, in 2024.

import { BadRequestError } from 'src/errors'
import { Description, Id, Ip4, Location } from 'src/value-objects'

export abstract class Device {
  public readonly numOfPorts: number

  public constructor(
    public readonly id: Id,
    public readonly description: Description,
    public readonly ip: Ip4,
    public readonly location: Location,
    numOfPorts: number,
  ) {
    if (numOfPorts < 1 || numOfPorts > 64) {
      throw new BadRequestError('invalid number of ports')
    }
    this.numOfPorts = numOfPorts
  }

  public toString(): string {
    const id = String(this.id).substring(0, 8)
    let desc = String(this.description)
    desc = desc.substring(0, 12) + (desc.length > 12 ? '...' : '')
    return `${id}:${desc}@${this.ip}:${this.location}`
  }

  public abstract get numOfPortsUsed(): number

  public abstract get genus(): string

  public abstract get species(): string
}

// EOF
