// Written by Ingo Schmidt, in 2024.

import { Knex } from 'knex'
import { DeviceModel, LinkModel, NetworkModel } from '../models'

const DEVICES: DeviceModel[] = [
  {
    genus: 'router',
    species: 'core',
    id: '10000000-0000-4000-8000-000000000000',
    desc: 'Ching Ling Core Router',
    ip: '8.8.8.1',
    lat: -27.595,
    lon: -48.548,
    country: 'BR',
    n_ports: 2,
  },
  {
    genus: 'router',
    species: 'edge',
    id: '20000000-0000-4000-8000-000000000000',
    desc: 'Ching Ling Edge Router',
    ip: '8.8.8.2',
    lat: -7,
    lon: -50,
    country: 'BR',
    n_ports: 2,
  },
  {
    genus: 'switch',
    species: 'l3',
    id: '30000000-0000-4000-8000-000000000000',
    desc: 'Ching Ling L3 Switch',
    ip: '8.8.8.3',
    lat: -7,
    lon: -50,
    n_ports: 2,
  },
]

const LINKS: LinkModel[] = [
  {
    parent: '10000000-0000-4000-8000-000000000000',
    child: '20000000-0000-4000-8000-000000000000',
  },
  {
    parent: '20000000-0000-4000-8000-000000000000',
    child: '30000000-0000-4000-8000-000000000000',
  },
]

const NETWORKS: NetworkModel[] = [
  {
    sw_id: '30000000-0000-4000-8000-000000000000',
    name: 'genesis',
    ip: '10.0.0.1',
    cidr: 24,
  },
]

export const seed = async (db: Knex) => {
  await db('devices').delete()
  await db('devices').insert(DEVICES)
  await db('links').delete()
  await db('links').insert(LINKS)
  await db('networks').delete()
  await db('networks').insert(NETWORKS)
}

// EOF
