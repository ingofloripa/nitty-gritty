// Written by Ingo Schmidt, in 2024.

import { InternalServerError } from 'src/errors'
import {
  AllPortsAreAvaliableRule,
  DeviceIsAtSuitableCountryRule,
  DeviceIsLinkableRule,
  DeviceIsLinkedRule,
  DeviceIsNotLinkedRule,
  IpIsDifferentRule,
  PortIsAvaliableRule,
} from 'src/rules'
import { Country, Description, Id, Ip4, Location } from 'src/value-objects'
import { Device } from './device'

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
    new DeviceIsNotLinkedRule(this, device).passOrThrow()
    new PortIsAvaliableRule(this).passOrThrow()
    new IpIsDifferentRule(this, device).passOrThrow()
    new DeviceIsLinkableRule(this, device).passOrThrow()
    new DeviceIsAtSuitableCountryRule(this, device).passOrThrow()
    this.devices.set(String(device.id), device)
  }

  public unlinkDevice(device: LINKABLE_DEVICE): void {
    new DeviceIsLinkedRule(this, device).passOrThrow()
    new AllPortsAreAvaliableRule(this).passOrThrow()
    this.devices.delete(String(device.id))
  }

  public get numOfPortsUsed(): number {
    this.assertIsNotShallowInstance()
    return this.devices.size
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
