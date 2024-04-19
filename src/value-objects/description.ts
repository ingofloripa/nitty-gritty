// Written by Ingo Schmidt, in 2024.

import { BadRequestError } from 'src/errors'

export class Description {
  public constructor(description: string) {
    if (description.length === 0) {
      throw new BadRequestError('invalid description (empty string)')
    }
    if (description.length > 128) {
      throw new BadRequestError('invalid description (string too long)', { description })
    }
    this.value = description
  }

  public toString(): string {
    return this.value
  }

  private readonly value: string
}

// EOF
