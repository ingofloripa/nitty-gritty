// Written by Ingo Schmidt, in 2024.

import { L3Switch, Router } from 'src/entities'
import { Network } from 'src/value-objects'
import { L3SwitchDto, NetworkDto, RouterDto } from './dtos'

export const mapFromRouter = (router: Router): RouterDto => ({
  type: router.species,
  id: String(router.id),
  description: String(router.description),
  ip: String(router.ip),
  latitude: router.location.point.lat,
  longitude: router.location.point.lon,
  numOfPorts: router.numOfPorts,
  linkedDeviceIds: router.getLinkedDevices().map(String),
})

const mapFromNetwork = (network: Network): NetworkDto => ({
  name: network.name,
  ip: String(network.ip),
  cidr: network.cidr,
})

export const mapFromL3Switch = (l3switch: L3Switch): L3SwitchDto => ({
  id: String(l3switch.id),
  description: String(l3switch.description),
  ip: String(l3switch.ip),
  latitude: l3switch.location.point.lat,
  longitude: l3switch.location.point.lon,
  numOfPorts: l3switch.numOfPorts,
  networks: l3switch.getNetworks().map(mapFromNetwork),
})

// EOF
