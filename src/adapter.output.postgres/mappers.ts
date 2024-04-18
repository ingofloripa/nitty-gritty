// Written by Ingo Schmidt, in 2024.

import { CoreRouter, Device, EdgeRouter, L3Switch, Router } from 'src/entities'
import { InternalServerError } from 'src/errors'
import { Country, Description, Id, Ip4, Location, Network } from 'src/value-objects'
import { DeviceModel, NetworkModel } from './models'

const mapFromDevice = (device: Device): DeviceModel => ({
  genus: device.genus,
  species: device.species,
  id: String(device.id),
  desc: String(device.description),
  ip: String(device.ip),
  lat: device.location.point.lat,
  lon: device.location.point.lon,
  n_ports: device.numOfPorts,
})

export const mapFromRouter = (router: Router): DeviceModel => {
  const model = mapFromDevice(router)
  return { ...model, country: router.country }
}

export const mapFromL3Switch = (l3switch: L3Switch): DeviceModel =>
  mapFromDevice(l3switch)

export const mapToDevice = <T extends Device = Device>(model: DeviceModel): T => {
  const id = Id.from(model.id)
  const desc = new Description(model.desc)
  const ip = new Ip4(model.ip)
  const location = new Location({ lat: model.lat, lon: model.lon })
  const country = model.country as Country
  const numOfPorts = model.n_ports
  switch (`${model.genus}:${model.species}`) {
    case 'router:core':
      return new CoreRouter(id, desc, ip, location, country, numOfPorts) as unknown as T
    case 'router:edge':
      return new EdgeRouter(id, desc, ip, location, country, numOfPorts) as unknown as T
    case 'switch:l3':
      return new L3Switch(id, desc, ip, location, numOfPorts) as unknown as T
    default:
      throw new InternalServerError('unknown type of device')
  }
}

export const mapFromNetwork = (switchId: Id, network: Network): NetworkModel => ({
  sw_id: String(switchId),
  name: network.name,
  ip: String(network.ip),
  cidr: network.cidr,
})

export const mapToNetwork = (model: NetworkModel): Network =>
  new Network(model.name, new Ip4(model.ip), model.cidr)

// EOF
