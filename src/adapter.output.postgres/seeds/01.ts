// Written by Ingo Schmidt, in 2024.

import { Knex } from 'knex'
import { DeviceModel, LinkModel, NetworkModel } from '../models'

const DEVICES: DeviceModel[] = [
  {
    type: 'router',
    subtype: 'core',
    id: '10000000-0000-4000-8000-000000000000',
    desc: 'Ching Ling Core Router',
    ip: '10.0.0.1',
    lat: -27.595,
    lon: -48.548,
    n_ports: 2,
  },
  {
    type: 'router',
    subtype: 'edge',
    id: '20000000-0000-4000-8000-000000000000',
    desc: 'Ching Ling Edge Router',
    ip: '10.0.0.2',
    lat: -7,
    lon: -50,
    n_ports: 2,
  },
  {
    type: 'switch',
    subtype: 'l3',
    id: '30000000-0000-4000-8000-000000000000',
    desc: 'Ching Ling Layer 3 Switch',
    ip: '10.0.0.3',
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
    name: 'pluto',
    ip: '192.168.0.0',
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
