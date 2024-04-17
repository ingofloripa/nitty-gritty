// Written by Ingo Schmidt, in 2024.

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost): any {
    if (
      !(error instanceof HttpException) ||
      error['status'] === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      Logger.error(error)
      console.error(error)
    }
    const status = Number(error['status'] || HttpStatus.INTERNAL_SERVER_ERROR)
    const response = host.switchToHttp().getResponse() as Response
    response.status(status).json(this.getBody(error))
  }

  private getBody(error: unknown): any {
    const messages: string[] = []
    while (!!error) {
      const msg =
        error['response']?.['message'] ||
        error['message'] ||
        String(error['code'] || '???')
      messages.push(msg)
      error = error['cause']
    }
    return {
      message: messages.flat(),
    }
  }
}

// EOF
