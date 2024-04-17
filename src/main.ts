// Written by Ingo Schmidt, in 2024.

import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { RestInputModule } from 'src/adapter.input.rest'
import { PostgresOutputModule } from 'src/adapter.output.postgres'
import { ErrorFilter } from './errors'

@Module({
  imports: [RestInputModule.register(PostgresOutputModule)],
})
class MainModule {}

const bootstrap = async () => {
  const app = await NestFactory.create(MainModule)
  app.useGlobalFilters(new ErrorFilter())
  await app.listen(3000)
}

bootstrap()

// EOF
