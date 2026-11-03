import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ColetasController } from './coletas.controller.js';
import { ColetasRepository } from './coletas.repository.js';

@Module({
  imports: [PrismaModule],
  controllers: [ColetasController],
  providers: [ColetasRepository],
  exports: [ColetasRepository],
})
export class ColetasModule {}
