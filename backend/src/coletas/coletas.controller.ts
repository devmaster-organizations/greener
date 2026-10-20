import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { paraNumero } from '../api/serializacao.js';
import {
  ColetasRepository,
  type ColetaComServico,
} from './coletas.repository.js';

const LIMIT_PADRAO = 50;
const LIMIT_MAXIMO = 500;

export interface ColetaResponse {
  id: string;
  servicoId: string;
  servicoNome: string;
  coletadaAt: Date;
  cpuPercent: number | null;
  memoryGb: number | null;
  diskGb: number | null;
  networkGb: number | null;
  potenciaW: number | null;
  energiaKwh: number | null;
  carbonIntensity: number | null;
  co2eG: number | null;
  status: string;
  erro: string | null;
}

export function paraColetaResponse(coleta: ColetaComServico): ColetaResponse {
  return {
    id: coleta.id,
    servicoId: coleta.servicoId,
    servicoNome: coleta.servico.nome,
    coletadaAt: coleta.coletadaAt,
    cpuPercent: paraNumero(coleta.cpuPercent),
    memoryGb: paraNumero(coleta.memoryGb),
    diskGb: paraNumero(coleta.diskGb),
    networkGb: paraNumero(coleta.networkGb),
    potenciaW: paraNumero(coleta.potenciaW),
    energiaKwh: paraNumero(coleta.energiaKwh),
    carbonIntensity: paraNumero(coleta.carbonIntensity),
    co2eG: paraNumero(coleta.co2eG),
    status: coleta.status,
    erro: coleta.erro,
  };
}

export function parseData(valor: string | undefined, campo: string): Date | undefined {
  if (valor === undefined || valor.trim() === '') {
    return undefined;
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    throw new BadRequestException(
      `Parâmetro "${campo}" inválido: use uma data ISO 8601 (ex.: 2026-10-13T00:00:00Z)`,
    );
  }

  return data;
}

export function parseLimit(valor: string | undefined): number {
  if (valor === undefined || valor.trim() === '') {
    return LIMIT_PADRAO;
  }

  const limit = Number(valor);

  if (!Number.isInteger(limit) || limit < 1 || limit > LIMIT_MAXIMO) {
    throw new BadRequestException(
      `Parâmetro "limit" inválido: use um inteiro entre 1 e ${LIMIT_MAXIMO}`,
    );
  }

  return limit;
}

@Controller('coletas')
export class ColetasController {
  constructor(private readonly coletas: ColetasRepository) {}

  @Get()
  async listar(
    @Query('servicoId') servicoId?: string,
    @Query('de') de?: string,
    @Query('ate') ate?: string,
    @Query('limit') limit?: string,
  ): Promise<ColetaResponse[]> {
    const coletas = await this.coletas.listar({
      servicoId: servicoId?.trim() || undefined,
      de: parseData(de, 'de'),
      ate: parseData(ate, 'ate'),
      limit: parseLimit(limit),
    });

    return coletas.map(paraColetaResponse);
  }
}
