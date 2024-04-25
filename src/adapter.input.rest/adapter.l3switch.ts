// Written by Ingo Schmidt, in 2024.

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common'
import { L3SwitchInputPort } from 'src/port.input'
import { Description, Id, Ip4, Location } from 'src/value-objects'
import { CreateL3SwitchArgsDto, IdDto, L3SwitchDto } from './dtos'
import { mapFromL3Switch } from './mappers'

@Controller('switch/')
export class L3SwitchInputAdapter {
  public constructor(private readonly l3switch: L3SwitchInputPort) {}

  @Get()
  async listSwitches(): Promise<string[]> {
    const ids = await this.l3switch.listAll()
    return ids.map(String)
  }

  @Get(':id')
  async retrieveSwitch(@Param('id') id: string): Promise<L3SwitchDto> {
    const l3switch = await this.l3switch.retrieve(Id.from(id))
    return mapFromL3Switch(l3switch)
  }

  @Post()
  async createSwitch(
    @Body(new ValidationPipe()) body: CreateL3SwitchArgsDto,
  ): Promise<IdDto> {
    const { id } = await this.l3switch.create({
      ip: new Ip4(body.ip),
      description: new Description(body.description),
      location: new Location({ lat: body.latitude, lon: body.longitude }),
      numOfPorts: body.numOfPorts,
    })
    return { id: String(id) }
  }

  @Post(':switchId/to/:edgeRouterId')
  async linkRouterToCoreRouter(
    @Param('switchId') switchId: string,
    @Param('edgeRouterId') edgeRouterId: string,
  ): Promise<void> {
    await this.l3switch.linkToEdgeRouter(Id.from(switchId), Id.from(edgeRouterId))
  }

  @Delete(':switchId/from/:edgeRouterId')
  async unlinkSwitchFromCoreRouter(
    @Param('switchId') switchId: string,
    @Param('edgeRouterId') edgeRouterId: string,
  ): Promise<void> {
    await this.l3switch.unlinkFromEdgeRouter(Id.from(switchId), Id.from(edgeRouterId))
  }

  @Delete(':id')
  async deleteSwitch(@Param('id') id: string): Promise<void> {
    await this.l3switch.delete(Id.from(id))
  }
}

// EOF
