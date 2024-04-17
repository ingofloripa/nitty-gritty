// Written by Ingo Schmidt, in 2024.

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'
import { Link, LinkOutputPort } from 'src/port.output'

@Injectable()
export class LinkOutputAdapter extends LinkOutputPort {
  public constructor(@InjectKnex() private readonly db: Knex) {
    super()
  }

  async create(link: Link): Promise<void> {
    await this.db('links').insert({
      parent: String(link.parentDeviceId),
      child: String(link.childDeviceId),
    })
  }

  async remove(link: Link): Promise<void> {
    await this.db('links')
      .where({ parent: String(link.parentDeviceId), child: String(link.childDeviceId) })
      .delete()
  }
}

// EOF
