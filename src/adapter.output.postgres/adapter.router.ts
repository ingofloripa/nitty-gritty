// Written by Ingo Schmidt, in 2024.

import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectKnex } from 'nestjs-knex'
import { Router } from 'src/entities'
import { InternalServerError, NotFoundError } from 'src/errors'
import { RouterOutputPort } from 'src/port.output'
import { Id } from 'src/value-objects'
import { mapFromDevice, mapToDevice } from './mappers'
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
    const routerModel = await this.fetchRouterModel(id)
    const router = mapToDevice<Router>(routerModel)
    const linkedDeviceModels = await this.fetchLinkedDeviceModels(id)
    const linkedDevices = linkedDeviceModels.map(mapToDevice)
    router.setLinkedDevices(linkedDevices)
    return router
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

  private async fetchLinkedDeviceModels(id: Id) {
    const links = await this.db<LinkModel>('links')
      .select('child')
      .where({ parent: String(id) })
    const routers = await this.db<DeviceModel>('devices').whereIn(
      'id',
      links.map((link) => link.child),
    )
    return routers
  }

  async persist(router: Router): Promise<void> {
    const model = mapFromDevice(router)
    await this.db('devices').insert(model)
    if (router.getLinkedDevices().length > 0) {
      throw new InternalServerError('Panic (unable to persist router linked devices)')
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
