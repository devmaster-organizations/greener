import { Controller, Get, Query } from '@nestjs/common';
import { paraNumeroOuZero } from '../api/serializacao.js';
import {
  ColetasRepository,
  type ColetaPorDia,
  type ImpactoServico,
  type TotalColetas,
} from '../coletas/coletas.repository.js';
import { parseData } from '../coletas/coletas.controller.js';
import { ServicosRepository } from '../servicos/servicos.repository.js';

export interface IndicadoresResponse {
  energiaTotalKwh: number;
  co2eTotalG: number;
  coletasRegistradas: number;
  servicosMonitorados: number;
  servicosIndisponiveis: number;
}

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly coletas: ColetasRepository,
    private readonly servicos: ServicosRepository,
  ) {}

  @Get('indicadores')
  async indicadores(
    @Query('de') de?: string,
    @Query('ate') ate?: string,
  ): Promise<IndicadoresResponse> {
    const [totais, servicosMonitorados, servicosIndisponiveis] =
      await Promise.all([
        this.coletas.somarTotais({
          de: parseData(de, 'de'),
          ate: parseData(ate, 'ate'),
        }),
        this.servicos.contarMonitorados(),
        this.servicos.contarIndisponiveis(),
      ]);

    return this.paraIndicadores(
      totais,
      servicosMonitorados,
      servicosIndisponiveis,
    );
  }

  @Get('historico')
  async historico(
    @Query('de') de?: string,
    @Query('ate') ate?: string,
  ): Promise<ColetaPorDia[]> {
    return this.coletas.co2ePorDia({
      de: parseData(de, 'de'),
      ate: parseData(ate, 'ate'),
    });
  }

  @Get('impacto-por-servico')
  async impactoPorServico(
    @Query('de') de?: string,
    @Query('ate') ate?: string,
  ): Promise<ImpactoServico[]> {
    return this.coletas.agruparPorServico({
      de: parseData(de, 'de'),
      ate: parseData(ate, 'ate'),
    });
  }

  private paraIndicadores(
    totais: TotalColetas,
    servicosMonitorados: number,
    servicosIndisponiveis: number,
  ): IndicadoresResponse {
    return {
      energiaTotalKwh: paraNumeroOuZero(totais.energiaKwh),
      co2eTotalG: paraNumeroOuZero(totais.co2eG),
      coletasRegistradas: totais.coletas,
      servicosMonitorados,
      servicosIndisponiveis,
    };
  }
}
