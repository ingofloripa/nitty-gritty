// Written by Ingo Schmidt, in 2024.

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'
import { NetworkOutputPort } from 'src/port.output/network'
import { Network, Id } from 'src/value-objects'

@Injectable()
export class NetworkOutputAdapter extends NetworkOutputPort {
  public constructor(@InjectKnex() private readonly db: Knex) {
    super()
  }

  async persist(network: Network, l3switchId: Id): Promise<void> {
    await this.db('networks').insert({
      sw_id: String(l3switchId),
      name: network.name,
      ip: String(network.ip),
      cidr: network.cidr,
    })
  }

  async delete(networkName: string, l3switchId: Id): Promise<void> {
    await this.db('networks')
      .where({ name: networkName, sw_id: String(l3switchId) })
      .delete()
  }
}

// EOF
