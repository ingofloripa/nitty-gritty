// Written by Ingo Schmidt, in 2024.

import { CoreRouter, EdgeRouter, Router } from 'src/entities'
import { InternalServerError } from 'src/errors'
import { CreateRouterArgs, RouterInputPort } from 'src/port.input'
import { LinkOutputPort, RouterOutputPort } from 'src/port.output'
import { AllPortsAreAvailableRule } from 'src/rules'
import { Id } from 'src/value-objects'

export class RouterUseCase extends RouterInputPort {
  public constructor(
    private readonly router: RouterOutputPort,
    private readonly link: LinkOutputPort,
  ) {
    super()
  }

  async listAll(): Promise<Id[]> {
    return this.router.listAll()
  }

  async retrieve(id: Id): Promise<Router> {
    return this.router.retrieve(id)
  }

  async create({
    type,
    description,
    ip,
    location,
    country,
    numOfPorts,
  }: CreateRouterArgs): Promise<Router> {
    const id = Id.create()
    let router: Router
    if (type === 'core') {
      router = new CoreRouter(id, description, ip, location, country, numOfPorts)
    } else if (type === 'edge') {
      router = new EdgeRouter(id, description, ip, location, country, numOfPorts)
    } else {
      throw new InternalServerError('unexpected router type', { type })
    }
    await this.router.persist(router)
    return router
  }

  async linkToCoreRouter(routerId: Id, coreRouterId: Id): Promise<void> {
    const coreRouter = await this.router.retrieve(coreRouterId)
    const router = await this.router.retrieve(routerId)
    coreRouter.linkDevice(router)
    await this.link.create({
      parentDeviceId: coreRouterId,
      childDeviceId: routerId,
    })
  }

  async unlinkFromCoreRouter(routerId: Id, coreRouterId: Id): Promise<void> {
    const coreRouter = await this.router.retrieve(coreRouterId)
    const router = await this.router.retrieve(routerId)
    coreRouter.unlinkDevice(router)
    await this.link.remove({
      parentDeviceId: coreRouterId,
      childDeviceId: routerId,
    })
  }

  async delete(id: Id): Promise<void> {
    const router = await this.router.retrieve(id)
    new AllPortsAreAvailableRule(router).passOrThrow()
    await this.router.delete(router.id)
  }
}

// EOF
