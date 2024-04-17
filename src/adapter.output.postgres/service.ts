// Written by Ingo Schmidt, in 2024.

import { Injectable, OnModuleInit } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'

@Injectable()
export class InitService implements OnModuleInit {
  public constructor(@InjectKnex() private readonly db: Knex) {}

  public async onModuleInit(): Promise<void> {
    const [, scripts] = await this.db.migrate.latest()
    for (const script of scripts) {
      await this.db.seed.run({ specific: script })
    }
  }
}

// EOF
