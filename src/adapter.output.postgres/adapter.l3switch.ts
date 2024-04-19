// Written by Ingo Schmidt, in 2024.

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'
import { L3Switch } from 'src/entities'
import { InternalServerError, NotFoundError } from 'src/errors'
import { L3SwitchOutputPort } from 'src/port.output'
import { Id } from 'src/value-objects'
import { mapFromL3Switch, mapToL3Switch } from './mappers'
import { DeviceModel, NetworkModel } from './models'

@Injectable()
export class L3SwitchOutputAdapter extends L3SwitchOutputPort {
  public constructor(@InjectKnex() private readonly db: Knex) {
    super()
  }

  async listAll(): Promise<Id[]> {
    const models = await this.db<DeviceModel>('devices')
      .select('id')
      .where({ genus: 'switch' })
    return models.map((model) => Id.from(model.id))
  }

  async retrieve(id: Id): Promise<L3Switch> {
    const l3switch = await this.fetchSwitchModel(id)
    const networks = await this.fetchNetworkModels(id)
    return mapToL3Switch(l3switch, networks)
  }

  private async fetchSwitchModel(id: Id): Promise<DeviceModel> {
    const model = await this.db<DeviceModel>('devices')
      .where({ genus: 'switch', id: String(id) })
      .first()
    if (model === undefined) {
      throw new NotFoundError('switch not found', { id: String(id) })
    }
    return model
  }

  private async fetchNetworkModels(id: Id) {
    return this.db<NetworkModel>('networks').where({ sw_id: String(id) })
  }

  async persist(l3switch: L3Switch): Promise<void> {
    const model = mapFromL3Switch(l3switch)
    await this.db('devices').insert(model)
    if (l3switch.getNetworks().length > 0) {
      throw new InternalServerError('unable to persist switch networks', {
        id: String(l3switch.id),
      })
    }
  }

  async delete(id: Id): Promise<void> {
    const count = await this.db('devices')
      .where({ type: 'switch', id: String(id) })
      .delete()
    if (count === 0) {
      throw new NotFoundError('switch not found', { id: String(id) })
    }
    // #TRICK: links table will be updated automatically by cascading
  }
}

// EOF
