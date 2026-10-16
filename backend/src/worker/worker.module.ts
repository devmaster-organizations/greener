import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MonitoramentoModule } from '../monitoramento/monitoramento.module.js';

/**
 * Módulo raiz do Worker: um aplicativo NestJS sem servidor HTTP, que executa
 * os ciclos de coleta em background.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MonitoramentoModule,
  ],
})
export class WorkerModule {}
