// Written by Ingo Schmidt, in 2024.

export interface DeviceModel {
  genus: string
  species: string
  id: string // format: UUID
  desc: string
  ip: string
  lat: number
  lon: number
  country?: string
  n_ports: number
}

export interface LinkModel {
  parent: string // format: UUID
  child: string // format: UUID
}

export interface NetworkModel {
  sw_id: string // format: UUID
  name: string
  ip: string
  cidr: number
}

// EOF
