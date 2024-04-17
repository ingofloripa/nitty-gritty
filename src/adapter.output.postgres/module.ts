// Written by Ingo Schmidt, in 2024.

import { Module } from '@nestjs/common'
import { KnexModule } from 'nestjs-knex'
import { L3SwitchOutputPort, LinkOutputPort, RouterOutputPort } from 'src/port.output'
import { L3SwitchOutputAdapter } from './adapter.l3switch'
import { LinkOutputAdapter } from './adapter.link'
import { RouterOutputAdapter } from './adapter.router'
import { InitService } from './service'
import { NetworkOutputPort } from 'src/port.output/network'
import { NetworkOutputAdapter } from './adapter.network'

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: 'postgres://postgres@postgres/nitty_gritty',
        // debug: true,
        migrations: {
          directory: __dirname + '/migrations',
          loadExtensions: ['.js'],
        },
        seeds: {
          directory: __dirname + '/seeds',
          loadExtensions: ['.js'],
        },
      },
    }),
  ],
  providers: [
    InitService,
    {
      provide: LinkOutputPort,
      useClass: LinkOutputAdapter,
    },
    {
      provide: RouterOutputPort,
      useClass: RouterOutputAdapter,
    },
    {
      provide: L3SwitchOutputPort,
      useClass: L3SwitchOutputAdapter,
    },
    {
      provide: NetworkOutputPort,
      useClass: NetworkOutputAdapter,
    },
  ],
  exports: [LinkOutputPort, RouterOutputPort, L3SwitchOutputPort, NetworkOutputPort],
})
export class PostgresOutputModule {}

// EOF
