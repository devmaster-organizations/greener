import { Module } from '@nestjs/common';
import { ColetasModule } from '../coletas/coletas.module.js';
import { ServicosModule } from '../servicos/servicos.module.js';
import { DashboardController } from './dashboard.controller.js';

@Module({
  imports: [ColetasModule, ServicosModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
