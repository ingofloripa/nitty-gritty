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
import { env } from 'process'

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost): any {
    if (
      env['DEBUG'] === 'on' ||
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
    const responses: Record<string, unknown>[] = []
    let cause: any = error
    while (!!cause) {
      let response: Record<string, unknown>
      if (cause.response !== undefined) {
        response = cause.response
      } else {
        // #TRICK: Prop `message` could be non-enumerated.
        response = { message: cause.message ?? '???', ...cause }
      }
      responses.push(response)
      cause = cause['cause']
    }
    return responses
  }
}

// EOF
