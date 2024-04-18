// Written by Ingo Schmidt, in 2024.

import { IsNumber, IsString } from 'class-validator'

export class CreateDeviceArgsDto {
  @IsString()
  ip: string
  @IsString()
  description: string
  @IsNumber()
  latitude: number
  @IsNumber()
  longitude: number
  @IsNumber()
  numOfPorts: number
}

export class CreateRouterArgsDto extends CreateDeviceArgsDto {
  @IsString()
  type: string
}

export class CreateL3SwitchArgsDto extends CreateDeviceArgsDto {}

export class AddNetworkArgsDto {
  @IsString()
  name: string
  @IsString()
  ip: string
  @IsNumber()
  cidr: number
}

export interface DeviceDto {
  id: string
  description: string
  ip: string
  latitude: number
  longitude: number
  numOfPorts: number
}

export interface IdDto {
  id: string
}

export interface NetworkDto {
  name: string
  ip: string
  cidr: number
}

export interface RouterDto extends DeviceDto {
  type: string
  linkedDeviceIds: string[]
}

export interface L3SwitchDto extends DeviceDto {
  networks: NetworkDto[]
}

// EOF
