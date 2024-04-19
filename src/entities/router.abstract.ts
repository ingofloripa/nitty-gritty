// Written by Ingo Schmidt, in 2024.

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

  // #TRICK: Late initialization.
  // Required for entity rehidration from the output port.
  // This function has no sanity checks at all, the caller is responsable to do it.
  public initializeLinkedDevices(linkedDevices: Id[]): void {
    for (const deviceId of linkedDevices) {
      this.deviceIds.add(String(deviceId))
      if (this.deviceIds.size === this.numOfPorts) {
        break
      }
    }
  }

  public getLinkedDevices(): Id[] {
    return Array.from(this.deviceIds.values()).map(Id.from)
  }

  public linkDevice(device: LINKABLE_DEVICE): void {
    new DeviceIsNotLinkedRule(this, device).passOrThrow()
    new PortIsAvaliableRule(this).passOrThrow()
    new IpIsDifferentRule(this, device).passOrThrow()
    new DeviceIsLinkableRule(this, device).passOrThrow()
    new DeviceIsAtSuitableCountryRule(this, device).passOrThrow()
    this.deviceIds.add(String(device.id))
  }

  public unlinkDevice(device: LINKABLE_DEVICE): void {
    new DeviceIsLinkedRule(this, device).passOrThrow()
    new AllPortsAreAvaliableRule(this).passOrThrow()
    this.deviceIds.delete(String(device.id))
  }

  public get numOfPortsUsed(): number {
    return this.deviceIds.size
  }

  public get genus(): string {
    return 'router'
  }

  private readonly deviceIds = new Set<string>()
}

// EOF
