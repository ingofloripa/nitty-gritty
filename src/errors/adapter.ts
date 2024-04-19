// Written by Ingo Schmidt, in 2024.

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

export class BadRequestError extends BadRequestException {
  public constructor(message: string, extras: Record<string, unknown> = {}) {
    super({ message, ...extras })
  }
}

export class ConflictError extends ConflictException {
  public constructor(message: string, extras: Record<string, unknown> = {}) {
    super({ message, ...extras })
  }
}

export class NotFoundError extends NotFoundException {
  public constructor(message: string, extras: Record<string, unknown> = {}) {
    super({ message, ...extras })
  }
}

export class InternalServerError extends InternalServerErrorException {
  public constructor(message: string, extras: Record<string, unknown> = {}) {
    super({ message: `[Panic] ${message}`, ...extras })
  }
}

// EOF
