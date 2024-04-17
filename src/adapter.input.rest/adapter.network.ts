// Written by Ingo Schmidt, in 2024.

import { Body, Controller, Delete, Param, Post, ValidationPipe } from '@nestjs/common'
import { NetworkInputPort } from 'src/port.input/network'
import { Id, Ip4, Network } from 'src/value-objects'
import { AddNetworkArgsDto } from './validators'

@Controller('network/')
export class NetworkInputAdapter {
  public constructor(private readonly network: NetworkInputPort) {}

  @Post('to/:l3switchId')
  async addToL3Switch(
    @Param('l3switchId') l3switchId: string,
    @Body(new ValidationPipe()) body: AddNetworkArgsDto,
  ): Promise<void> {
    const { name, ip, cidr } = body
    const network = new Network(name, new Ip4(ip), cidr)
    await this.network.addToL3Switch(network, Id.from(l3switchId))
  }

  @Delete(':networkName/from/:l3switchId')
  async removeFromL3Switch(
    @Param('networkName') networkName: string,
    @Param('l3switchId') l3switchId: string,
  ): Promise<void> {
    await this.network.removeFromL3Switch(networkName, Id.from(l3switchId))
  }
}

// EOF
