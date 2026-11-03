import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ServicosController } from './servicos.controller.js';
import { ServicosRepository } from './servicos.repository.js';

@Module({
  imports: [PrismaModule],
  controllers: [ServicosController],
  providers: [ServicosRepository],
  exports: [ServicosRepository],
})
export class ServicosModule {}