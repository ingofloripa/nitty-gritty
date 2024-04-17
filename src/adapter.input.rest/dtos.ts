// Written by Ingo Schmidt, in 2024.

export interface DeviceDto {
  id: string
  description: string
  ip: string
  latitude: number
  longitude: number
  numOfPorts: number
}

export interface RouterDto extends DeviceDto {
  type: string
  linkedDeviceIds: string[]
}

export interface L3SwitchDto extends DeviceDto {
  networks: NetworkDto[]
}

export interface NetworkDto {
  name: string
  ip: string
  cidr: number
}

export interface IdDto {
  id: string
}

// EOF
