// Written by Ingo Schmidt, in 2024.

import { CoreRouter, Device, EdgeRouter, L3Switch, Router } from 'src/entities'
import { InternalServerError } from 'src/errors'
import { Country, Description, Id, Ip4, Location, Network } from 'src/value-objects'
import { DeviceModel, LinkModel, NetworkModel } from './models'

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

export const mapToRouter = <T extends Router = Router>(
  routerModel: DeviceModel,
  linkModels: LinkModel[],
): T => {
  if (routerModel.genus !== 'router') {
    throw new InternalServerError({
      message: 'invalid model',
      genus: routerModel.genus,
    })
  }
  const id = Id.from(routerModel.id)
  const desc = new Description(routerModel.desc)
  const ip = new Ip4(routerModel.ip)
  const location = new Location({ lat: routerModel.lat, lon: routerModel.lon })
  const country = routerModel.country as Country
  const numOfPorts = routerModel.n_ports
  let router: T
  switch (routerModel.species) {
    case 'core':
      router = new CoreRouter(id, desc, ip, location, country, numOfPorts) as T
      break
    case 'edge':
      router = new EdgeRouter(id, desc, ip, location, country, numOfPorts) as T
      break
    default:
      throw new InternalServerError('unknown type of router')
  }
  const linkedDevices: Id[] = linkModels.map((link) => Id.from(link.child))
  router.initializeLinkedDevices(linkedDevices)
  return router
}

const mapToNetwork = (model: NetworkModel): Network =>
  new Network(model.name, new Ip4(model.ip), model.cidr)

export const mapToL3Switch = (
  l3switchModel: DeviceModel,
  networkModels: NetworkModel[],
): L3Switch => {
  if (l3switchModel.genus !== 'switch') {
    throw new InternalServerError({
      message: 'invalid model',
      genus: l3switchModel.genus,
    })
  }
  const id = Id.from(l3switchModel.id)
  const desc = new Description(l3switchModel.desc)
  const ip = new Ip4(l3switchModel.ip)
  const location = new Location({ lat: l3switchModel.lat, lon: l3switchModel.lon })
  const numOfPorts = l3switchModel.n_ports
  const networks = networkModels.map(mapToNetwork)
  return new L3Switch(id, desc, ip, location, numOfPorts, networks)
}

// EOF
