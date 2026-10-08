import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ServicosRepository } from './servicos.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [ServicosRepository],
  exports: [ServicosRepository],
})
export class ServicosModule {}