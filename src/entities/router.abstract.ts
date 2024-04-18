// Written by Ingo Schmidt, in 2024.

import { ConflictError, InternalServerError } from 'src/errors'
import { Device } from './device'
import { Country, Description, Id, Ip4, Location } from 'src/value-objects'

export abstract class Router<LINKABLE_DEVICE extends Device = Device> extends Device {
  public constructor(
    id: Id,
    description: Description,
    ip: Ip4,
    location: Location,
    public readonly country: Country,
    numOfPorts: number,
  ) {
    super(id, description, ip, location, numOfPorts)
  }

  // #TRICK: late initialization required for entity rehidration from the output port
  public setLinkedDevices(devices: LINKABLE_DEVICE[]): void {
    this.devices = new Map<string, LINKABLE_DEVICE>()
    for (const device of devices) {
      this.devices.set(String(device.id), device)
      if (this.devices.size === this.numOfPorts) {
        break
      }
    }
  }

  public getLinkedDevices(): LINKABLE_DEVICE[] {
    this.assertIsNotShallowInstance()
    return Array.from(this.devices.values())
  }

  public linkDevice(device: LINKABLE_DEVICE): void {
    this.assertIsNotShallowInstance()
    if (this.devices.has(String(device.id))) {
      throw new ConflictError('device already linked')
    }
    if (this.isAllPortsUsed()) {
      throw new ConflictError('unable to link another device (no ports available)')
    }
    if (!this.isDeviceLinkable(device)) {
      throw new ConflictError('unable to link this kind of device')
    }
    if (this.ip.isEqual(device.ip)) {
      throw new ConflictError('unable to link this device (same IP)')
    }
    this.devices.set(String(device.id), device)
  }

  protected abstract isDeviceLinkable(device: LINKABLE_DEVICE): boolean

  public unlinkDevice(device: LINKABLE_DEVICE): void {
    this.assertIsNotShallowInstance()
    if (this.devices === undefined || !this.devices.has(String(device.id))) {
      throw new ConflictError('device already unlinked')
    }
    if (!device.isAllPortsAvailable()) {
      throw new ConflictError('unable to unlink this device (it is in use)')
    }
    this.devices.delete(String(device.id))
  }

  public isAllPortsAvailable(): boolean {
    this.assertIsNotShallowInstance()
    return this.devices.size === 0
  }

  public isAllPortsUsed(): boolean {
    this.assertIsNotShallowInstance()
    return this.devices?.size === this.numOfPorts
  }

  public get genus(): string {
    return 'router'
  }

  private assertIsNotShallowInstance(): void {
    if (this.devices === undefined) {
      throw new InternalServerError({
        message: 'Panic (shallow router instance)',
        routerId: String(this.id),
      })
    }
  }

  private devices: Map<string, LINKABLE_DEVICE>
}

// EOF
