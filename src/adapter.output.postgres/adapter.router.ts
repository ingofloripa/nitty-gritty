// Written by Ingo Schmidt, in 2024.

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'
import { Router } from 'src/entities'
import { InternalServerError, NotFoundError } from 'src/errors'
import { RouterOutputPort } from 'src/port.output'
import { Id } from 'src/value-objects'
import { mapFromRouter, mapToRouter } from './mappers'
import { DeviceModel, LinkModel } from './models'

@Injectable()
export class RouterOutputAdapter extends RouterOutputPort {
  public constructor(@InjectKnex() private readonly db: Knex) {
    super()
  }

  async listAll(): Promise<Id[]> {
    const models = await this.db<DeviceModel>('devices')
      .select('id')
      .where({ genus: 'router' })
    return models.map((model) => Id.from(model.id))
  }

  async retrieve(id: Id): Promise<Router> {
    const router = await this.fetchRouterModel(id)
    const links = await this.fetchLinkModels(id)
    return mapToRouter(router, links)
  }

  private async fetchRouterModel(id: Id): Promise<DeviceModel> {
    const model = await this.db<DeviceModel>('devices')
      .where({ genus: 'router', id: String(id) })
      .first()
    if (model === undefined) {
      throw new NotFoundError('router not found')
    }
    return model
  }

  private fetchLinkModels(id: Id) {
    return this.db<LinkModel>('links').where({ parent: String(id) })
  }

  async persist(router: Router): Promise<void> {
    const model = mapFromRouter(router)
    await this.db('devices').insert(model)
    if (router.getLinkedDevices().length > 0) {
      throw new InternalServerError('Panic (unable to persist router links)')
    }
  }

  async delete(id: Id): Promise<void> {
    const count = await this.db('devices')
      .where({ type: 'router', id: String(id) })
      .delete()
    if (count === 0) {
      throw new NotFoundError('router not found')
    }
    // #TRICK: links table will be updated automatically by cascading
  }
}

// EOF
