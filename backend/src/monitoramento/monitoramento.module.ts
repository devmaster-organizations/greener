import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgregadorModule } from '../agregador/agregador.module.js';
import { CarbonModule } from '../carbon/carbon.module.js';
import { ColetasModule } from '../coletas/coletas.module.js';
import { ServicosModule } from '../servicos/servicos.module.js';
import { MonitoramentoService } from './monitoramento.service.js';

@Module({
  imports: [
    ConfigModule,
    AgregadorModule,
    CarbonModule,
    ServicosModule,
    ColetasModule,
  ],
  providers: [MonitoramentoService],
})
export class MonitoramentoModule {}
