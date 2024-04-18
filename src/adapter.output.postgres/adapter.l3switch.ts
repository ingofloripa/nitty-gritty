// Written by Ingo Schmidt, in 2024.

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'
import { L3Switch } from 'src/entities'
import { InternalServerError, NotFoundError } from 'src/errors'
import { L3SwitchOutputPort } from 'src/port.output'
import { Id } from 'src/value-objects'
import { mapFromL3Switch, mapToDevice, mapToNetwork } from './mappers'
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
    const model = await this.fetchSwitchModel(id)
    const l3switch = mapToDevice<L3Switch>(model)
    const networksModels = await this.fetchNetworkModels(id)
    const networks = networksModels.map(mapToNetwork)
    l3switch.setNetworks(networks)
    return l3switch
  }

  private async fetchSwitchModel(id: Id): Promise<DeviceModel> {
    const model = await this.db<DeviceModel>('devices')
      .where({ genus: 'switch', id: String(id) })
      .first()
    if (model === undefined) {
      throw new NotFoundError('switch not found')
    }
    return model
  }

  private async fetchNetworkModels(id: Id) {
    const models = await this.db<NetworkModel>('networks').where({
      sw_id: String(id),
    })
    return models
  }

  async persist(l3switch: L3Switch): Promise<void> {
    const model = mapFromL3Switch(l3switch)
    await this.db('devices').insert(model)
    if (l3switch.getNetworks().length > 0) {
      throw new InternalServerError('Panic (unable to persist switch networks)')
    }
  }

  async delete(id: Id): Promise<void> {
    const count = await this.db('devices')
      .where({ type: 'switch', id: String(id) })
      .delete()
    if (count === 0) {
      throw new NotFoundError('switch not found')
    }
    // #TRICK: links table will be updated automatically by cascading
  }
}

// EOF
