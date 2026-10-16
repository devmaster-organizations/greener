import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { StatusColeta } from '../dominio/status-servico.js';

export interface RegistrarColetaInput {
  servicoId: string;
  coletadaAt: Date;
  status: StatusColeta;
  cpuPercent?: number | null;
  memoryGb?: number | null;
  diskGb?: number | null;
  networkGb?: number | null;
  potenciaW?: number | null;
  energiaKwh?: number | null;
  carbonIntensity?: number | null;
  co2eG?: number | null;
  erro?: string | null;
}

@Injectable()
export class ColetasRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async registrar(coleta: RegistrarColetaInput): Promise<void> {
    await this.prisma.coleta.create({ data: { ...coleta } });
  }
}
