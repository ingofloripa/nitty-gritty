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

// EOF
