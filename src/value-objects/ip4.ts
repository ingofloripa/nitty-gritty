// Written by Ingo Schmidt, in 2024.

import { BadRequestError } from 'src/errors'

export class Ip4 {
  public constructor(ip: string) {
    const parts = ip.split('.')
    if (parts.length !== 4) {
      throw new BadRequestError('invalid IP (wrong number of octets)')
    }
    const octets = parts.map((s) => Number.parseInt(s, 10))
    octets.forEach((octet, index) => {
      if (Number.isNaN(octet) || octet < 0 || octet > 255) {
        throw new BadRequestError(`invalid IP (invalid octet #${index + 1})`)
      }
    })
    this._octets = octets
  }

  public isEqual(ip: Ip4): boolean {
    return String(ip) === String(this)
  }

  public toString(): string {
    const o = this._octets
    return `${o[0]}.${o[1]}.${o[2]}.${o[3]}`
  }

  public get octets(): number[] {
    return [...this._octets]
  }

  private readonly _octets: number[]
}

// EOF
