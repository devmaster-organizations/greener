import { describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import type { Servico } from '../generated/prisma/client.js';
import { ServicosController } from './servicos.controller.js';
import { ServicosRepository } from './servicos.repository.js';

const SERVICO: Servico = {
  id: 'billing-api',
  nome: 'Billing API',
  regionCode: 'br-sudeste',
  pais: 'Brazil',
  regiao: 'Sudeste',
  cidade: 'Sao Paulo',
  latitude: -23.5505 as never,
  longitude: -46.6333 as never,
  metricsPath: '/metrics/billing-api',
  status: 'ATIVO',
  ultimaColetaAt: new Date('2026-10-13T10:30:00Z'),
  createdAt: new Date('2026-10-01T00:00:00Z'),
  updatedAt: new Date('2026-10-13T10:30:00Z'),
};

function criarController(servicos: Partial<ServicosRepository> = {}) {
  const repository = {
    listar: vi.fn().mockResolvedValue([]),
    buscarPorId: vi.fn().mockResolvedValue(null),
    ...servicos,
  };

  return {
    controller: new ServicosController(repository as unknown as ServicosRepository),
    repository,
  };
}

describe('ServicosController', () => {
  it('lista serviços serializados como resposta', async () => {
    const { controller, repository } = criarController({
      listar: vi.fn().mockResolvedValue([SERVICO]),
    });

    const resposta = await controller.listar();

    expect(repository.listar).toHaveBeenCalledTimes(1);
    expect(resposta).toEqual([
      {
        id: 'billing-api',
        nome: 'Billing API',
        status: 'ATIVO',
        regionCode: 'br-sudeste',
        pais: 'Brazil',
        regiao: 'Sudeste',
        cidade: 'Sao Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        metricsPath: '/metrics/billing-api',
        ultimaColetaAt: SERVICO.ultimaColetaAt,
        createdAt: SERVICO.createdAt,
        updatedAt: SERVICO.updatedAt,
      },
    ]);
    expect(typeof resposta[0].latitude).toBe('number');
    expect(typeof resposta[0].longitude).toBe('number');
  });

  it('serializa latitude e longitude nulas como null', async () => {
    const { controller } = criarController({
      listar: vi.fn().mockResolvedValue([{ ...SERVICO, latitude: null, longitude: null }]),
    });

    const [servico] = await controller.listar();

    expect(servico.latitude).toBeNull();
    expect(servico.longitude).toBeNull();
  });

  it('retorna o detalhe de um serviço existente', async () => {
    const { controller, repository } = criarController({
      buscarPorId: vi.fn().mockResolvedValue(SERVICO),
    });

    const resposta = await controller.detalhar('billing-api');

    expect(repository.buscarPorId).toHaveBeenCalledWith('billing-api');
    expect(resposta).toMatchObject({
      id: 'billing-api',
      nome: 'Billing API',
      status: 'ATIVO',
    });
  });

  it('lança NotFoundException quando o serviço não existe', async () => {
    const { controller } = criarController();

    await expect(controller.detalhar('inexistente')).rejects.toThrow(
      NotFoundException,
    );
    await expect(controller.detalhar('inexistente')).rejects.toThrow(
      'Serviço "inexistente" não encontrado',
    );
  });
});
