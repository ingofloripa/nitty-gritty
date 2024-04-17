// Written by Ingo Schmidt, in 2024.

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

export const BadRequestError = BadRequestException
export const ConflictError = ConflictException
export const InternalServerError = InternalServerErrorException
export const NotFoundError = NotFoundException

// EOF
