import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Servico } from '../generated/prisma/client.js';
import { StatusServico } from '../dominio/status-servico.js';

export interface SalvarServicoInput {
  id: string;
  nome: string;
  regionCode: string;
  metricsPath: string;
  pais?: string | null;
  regiao?: string | null;
  cidade?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

@Injectable()
export class ServicosRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Insere ou atualiza um serviço e o reativa (status ATIVO). Usado a cada
   * ciclo para refletir a descoberta de serviços do agregador.
   */
  async salvar(servico: SalvarServicoInput): Promise<void> {
    const { id, ...dados } = servico;

    await this.prisma.servico.upsert({
      where: { id },
      create: {
        id,
        ...dados,
        status: StatusServico.Ativo,
      },
      update: {
        ...dados,
        status: StatusServico.Ativo,
      },
    });
  }

  async listar(): Promise<Servico[]> {
    return this.prisma.servico.findMany();
  }

  async atualizarStatus(
    id: string,
    status: StatusServico,
    ultimaColetaAt?: Date,
  ): Promise<void> {
    await this.prisma.servico.update({
      where: { id },
      data: {
        status,
        ...(ultimaColetaAt ? { ultimaColetaAt } : {}),
      },
    });
  }

  /**
   * Marca como REMOVIDO todo serviço que não está mais presente na lista
   * atual do agregador. Preserva o histórico de coletas.
   */
  async marcarRemovidosExceto(idsAtivos: string[]): Promise<number> {
    const resultado = await this.prisma.servico.updateMany({
      where: {
        id: { notIn: idsAtivos },
        status: { not: StatusServico.Removido },
      },
      data: { status: StatusServico.Removido },
    });

    return resultado.count;
  }
}
