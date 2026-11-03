import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { paraNumero } from '../api/serializacao.js';
import type { Servico } from '../generated/prisma/client.js';
import { ServicosRepository } from './servicos.repository.js';

export interface ServicoResponse {
  id: string;
  nome: string;
  status: string;
  regionCode: string;
  pais: string | null;
  regiao: string | null;
  cidade: string | null;
  latitude: number | null;
  longitude: number | null;
  metricsPath: string;
  ultimaColetaAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function paraServicoResponse(servico: Servico): ServicoResponse {
  return {
    id: servico.id,
    nome: servico.nome,
    status: servico.status,
    regionCode: servico.regionCode,
    pais: servico.pais,
    regiao: servico.regiao,
    cidade: servico.cidade,
    latitude: paraNumero(servico.latitude),
    longitude: paraNumero(servico.longitude),
    metricsPath: servico.metricsPath,
    ultimaColetaAt: servico.ultimaColetaAt,
    createdAt: servico.createdAt,
    updatedAt: servico.updatedAt,
  };
}

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicos: ServicosRepository) {}

  @Get()
  async listar(): Promise<ServicoResponse[]> {
    const servicos = await this.servicos.listar();
    return servicos.map(paraServicoResponse);
  }

  @Get(':id')
  async detalhar(@Param('id') id: string): Promise<ServicoResponse> {
    const servico = await this.servicos.buscarPorId(id);

    if (!servico) {
      throw new NotFoundException(`Serviço "${id}" não encontrado`);
    }

    return paraServicoResponse(servico);
  }
}
