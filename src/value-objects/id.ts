// Written by Ingo Schmidt, in 2024.

import { BadRequestError } from 'src/errors'
import { v4 as createUuid, validate as validateUuid } from 'uuid'

export class Id {
  public static from(id: string | Id): Id {
    return new Id(id)
  }

  public static create(): Id {
    return new Id(createUuid())
  }

  private constructor(id: string | Id) {
    const value = String(id)
    if (!validateUuid(value)) {
      throw new BadRequestError('invalid ID (must be an UUID)', { id: value })
    }
    this.value = value
  }

  public isEqual(id?: string | Id | null): boolean {
    const value = String(id)
    return this.value === value
  }

  public toString(): string {
    return this.value
  }

  private readonly value: string
}

// EOF
