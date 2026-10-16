import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ColetasRepository } from './coletas.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [ColetasRepository],
  exports: [ColetasRepository],
})
export class ColetasModule {}
