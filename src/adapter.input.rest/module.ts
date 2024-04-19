// Written by Ingo Schmidt, in 2024.

import { DynamicModule, Module } from '@nestjs/common'
import { L3SwitchInputPort, RouterInputPort } from 'src/port.input'
import { L3SwitchOutputPort, LinkOutputPort, RouterOutputPort } from 'src/port.output'
import { L3SwitchUseCase, RouterUseCase } from 'src/use-cases'
import { L3SwitchInputAdapter } from './adapter.l3switch'
import { RouterInputAdapter } from './adapter.router'
import { NetworkInputPort } from 'src/port.input/network'
import { NetworkOutputPort } from 'src/port.output/network'
import { NetworkUseCase } from 'src/use-cases/network'
import { NetworkInputAdapter } from './adapter.network'

@Module({})
export class RestInputModule {
  static register(OutputModule: any): DynamicModule {
    return {
      module: RestInputModule,
      imports: [OutputModule],
      controllers: [RouterInputAdapter, L3SwitchInputAdapter, NetworkInputAdapter],
      providers: [
        {
          provide: RouterInputPort,
          useFactory: (router: RouterOutputPort, link: LinkOutputPort): RouterInputPort =>
            new RouterUseCase(router, link),
          inject: [RouterOutputPort, LinkOutputPort],
        },
        {
          provide: L3SwitchInputPort,
          useFactory: (
            l3switch: L3SwitchOutputPort,
            router: RouterOutputPort,
            link: LinkOutputPort,
          ): L3SwitchInputPort => new L3SwitchUseCase(l3switch, router, link),
          inject: [L3SwitchOutputPort, RouterOutputPort, LinkOutputPort],
        },
        {
          provide: NetworkInputPort,
          useFactory: (
            network: NetworkOutputPort,
            l3switch: L3SwitchOutputPort,
          ): NetworkInputPort => new NetworkUseCase(network, l3switch),
          inject: [NetworkOutputPort, L3SwitchOutputPort],
        },
      ],
    }
  }
}

// EOF
