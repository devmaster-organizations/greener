import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Coleta, Servico } from '../generated/prisma/client.js';
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

export interface FiltrosColetas {
  servicoId?: string;
  de?: Date;
  ate?: Date;
  limit?: number;
}

export interface FiltroPeriodo {
  de?: Date;
  ate?: Date;
}

export interface TotalColetas {
  energiaKwh: number;
  co2eG: number;
  coletas: number;
}

export interface ColetaPorDia {
  dia: string;
  energiaKwh: number;
  co2eG: number;
}

export interface ImpactoServico {
  servicoId: string;
  servicoNome: string;
  energiaKwh: number;
  co2eG: number;
}

export type ColetaComServico = Coleta & { servico: Pick<Servico, 'id' | 'nome'> };

@Injectable()
export class ColetasRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async registrar(coleta: RegistrarColetaInput): Promise<void> {
    await this.prisma.coleta.create({ data: { ...coleta } });
  }

  async listar(filtros: FiltrosColetas = {}): Promise<ColetaComServico[]> {
    return this.prisma.coleta.findMany({
      where: this.construirWhereColetas(filtros),
      orderBy: { coletadaAt: 'desc' },
      take: filtros.limit,
      include: {
        servico: { select: { id: true, nome: true } },
      },
    });
  }

  async somarTotais(filtro: FiltroPeriodo = {}): Promise<TotalColetas> {
    const agregado = await this.prisma.coleta.aggregate({
      where: this.construirWherePeriodo(filtro),
      _sum: { energiaKwh: true, co2eG: true },
      _count: true,
    });

    return {
      energiaKwh: Number(agregado._sum.energiaKwh ?? 0),
      co2eG: Number(agregado._sum.co2eG ?? 0),
      coletas: agregado._count,
    };
  }

  async co2ePorDia(filtro: FiltroPeriodo = {}): Promise<ColetaPorDia[]> {
    const condicoes: Prisma.Sql[] = [
      Prisma.sql`(co2e_g IS NOT NULL OR energia_kwh IS NOT NULL)`,
    ];

    if (filtro.de) {
      condicoes.push(Prisma.sql`coletada_at >= ${filtro.de}`);
    }

    if (filtro.ate) {
      condicoes.push(Prisma.sql`coletada_at <= ${filtro.ate}`);
    }

    const where = Prisma.join(condicoes, ' AND ');

    const linhas = await this.prisma.$queryRaw<
      Array<{ dia: string | Date; energia_kwh: unknown; co2e_g: unknown }>
    >(Prisma.sql`
      SELECT (date_trunc('day', coletada_at AT TIME ZONE 'UTC'))::date AS dia,
             COALESCE(SUM(energia_kwh), 0) AS energia_kwh,
             COALESCE(SUM(co2e_g), 0) AS co2e_g
      FROM coletas
      WHERE ${where}
      GROUP BY dia
      ORDER BY dia
    `);

    return linhas.map((linha) => ({
      dia:
        typeof linha.dia === 'string'
          ? linha.dia.slice(0, 10)
          : new Date(linha.dia).toISOString().slice(0, 10),
      energiaKwh: Number(linha.energia_kwh),
      co2eG: Number(linha.co2e_g),
    }));
  }

  async agruparPorServico(
    filtro: FiltroPeriodo = {},
  ): Promise<ImpactoServico[]> {
    const grupos = await this.prisma.coleta.groupBy({
      by: ['servicoId'],
      where: this.construirWherePeriodo(filtro),
      _sum: { energiaKwh: true, co2eG: true },
    });

    if (grupos.length === 0) {
      return [];
    }

    const servicos = await this.prisma.servico.findMany({
      where: { id: { in: grupos.map((grupo) => grupo.servicoId) } },
      select: { id: true, nome: true },
    });

    const nomes = new Map(servicos.map((servico) => [servico.id, servico.nome]));

    return grupos
      .map((grupo) => ({
        servicoId: grupo.servicoId,
        servicoNome: nomes.get(grupo.servicoId) ?? grupo.servicoId,
        energiaKwh: Number(grupo._sum.energiaKwh ?? 0),
        co2eG: Number(grupo._sum.co2eG ?? 0),
      }))
      .sort((a, b) => b.co2eG - a.co2eG);
  }

  private construirWhereColetas(filtros: FiltrosColetas): Prisma.ColetaWhereInput {
    return {
      ...(filtros.servicoId ? { servicoId: filtros.servicoId } : {}),
      ...this.construirWherePeriodo(filtros),
    };
  }

  private construirWherePeriodo(filtro: FiltroPeriodo): Prisma.ColetaWhereInput {
    if (!filtro.de && !filtro.ate) {
      return {};
    }

    return {
      coletadaAt: {
        ...(filtro.de ? { gte: filtro.de } : {}),
        ...(filtro.ate ? { lte: filtro.ate } : {}),
      },
    };
  }
}
