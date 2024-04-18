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
import { RouterInputPort } from 'src/port.input'
import { Description, Id, Ip4, Location } from 'src/value-objects'
import { CreateRouterArgsDto, IdDto, RouterDto } from './dtos'
import { mapFromRouter } from './mappers'

@Controller('router/')
export class RouterInputAdapter {
  public constructor(private readonly router: RouterInputPort) {}

  @Get()
  async listRouters(): Promise<string[]> {
    const ids = await this.router.listAll()
    return ids.map(String)
  }

  @Get(':id')
  async retrieveRouter(@Param('id') id: string): Promise<RouterDto> {
    const router = await this.router.retrieve(Id.from(id))
    return mapFromRouter(router)
  }

  @Post()
  async createRouter(
    @Body(new ValidationPipe()) body: CreateRouterArgsDto,
  ): Promise<IdDto> {
    const { id } = await this.router.create({
      type: body.type,
      ip: new Ip4(body.ip),
      description: new Description(body.description),
      location: new Location({ lat: body.latitude, lon: body.longitude }),
      numOfPorts: body.numOfPorts,
    })
    return { id: String(id) }
  }

  @Post(':routerId/to/:coreRouterId')
  async linkRouterToCoreRouter(
    @Param('routerId') routerId: string,
    @Param('coreRouterId') coreRouterId: string,
  ): Promise<void> {
    await this.router.linkToCoreRouter(Id.from(routerId), Id.from(coreRouterId))
  }

  @Delete(':routerId/from/:coreRouterId')
  async unlinkRouterFromCoreRouter(
    @Param('routerId') routerId: string,
    @Param('coreRouterId') coreRouterId: string,
  ): Promise<void> {
    await this.router.unlinkFromCoreRouter(Id.from(routerId), Id.from(coreRouterId))
  }

  @Delete(':id')
  async deleteRouter(@Param('id') id: string): Promise<void> {
    await this.router.delete(Id.from(id))
  }
}

// EOF
