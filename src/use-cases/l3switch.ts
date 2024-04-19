// Written by Ingo Schmidt, in 2024.

import { L3Switch } from 'src/entities'
import { CreateL3SwitchArgs, L3SwitchInputPort } from 'src/port.input'
import { L3SwitchOutputPort, LinkOutputPort, RouterOutputPort } from 'src/port.output'
import { AllPortsAreAvaliableRule } from 'src/rules'
import { Id } from 'src/value-objects'

export class L3SwitchUseCase extends L3SwitchInputPort {
  public constructor(
    private readonly l3switch: L3SwitchOutputPort,
    private readonly router: RouterOutputPort,
    private readonly link: LinkOutputPort,
  ) {
    super()
  }

  async listAll(): Promise<Id[]> {
    return this.l3switch.listAll()
  }

  async retrieve(id: Id): Promise<L3Switch> {
    return this.l3switch.retrieve(id)
  }

  async create({
    description,
    ip,
    location,
    numOfPorts,
  }: CreateL3SwitchArgs): Promise<L3Switch> {
    const id = Id.create()
    const l3switch = new L3Switch(id, description, ip, location, numOfPorts)
    l3switch.setNetworks([])
    await this.l3switch.persist(l3switch)
    return l3switch
  }

  async linkToEdgeRouter(l3switchId: Id, edgeRouterId: Id): Promise<void> {
    const edgeRouter = await this.router.retrieve(edgeRouterId)
    const l3switch = await this.l3switch.retrieve(l3switchId)
    edgeRouter.linkDevice(l3switch)
    await this.link.create({
      parentDeviceId: edgeRouterId,
      childDeviceId: l3switchId,
    })
  }

  async unlinkFromEdgeRouter(l3switchId: Id, edgeRouterId: Id): Promise<void> {
    const edgeRouter = await this.router.retrieve(edgeRouterId)
    const l3switch = await this.l3switch.retrieve(l3switchId)
    edgeRouter.unlinkDevice(l3switch)
    await this.link.remove({
      parentDeviceId: edgeRouterId,
      childDeviceId: l3switchId,
    })
  }

  async delete(id: Id): Promise<void> {
    const l3switch = await this.l3switch.retrieve(id)
    new AllPortsAreAvaliableRule(l3switch).passOrThrow()
    await this.l3switch.delete(l3switch.id)
  }
}

// EOF
