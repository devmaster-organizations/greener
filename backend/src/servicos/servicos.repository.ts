import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface SalvarServicoInput {
  id: string;
  nome: string;
  regionCode: string;
  metricsPath: string;
  pais?: string | null;
  regiao?: string | null;
  cidade?: string | null;
}

@Injectable()
export class ServicosRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async salvar(servico: SalvarServicoInput): Promise<void> {
    const { id, ...dados } = servico;

    await this.prisma.servico.upsert({
      where: { id },
      create: {
        id,
        ...dados,
      },
      update: dados,
    });
  }
}