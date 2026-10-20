import { describe, expect, it, vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import type { ColetaComServico } from './coletas.repository.js';
import { ColetasController } from './coletas.controller.js';
import { ColetasRepository } from './coletas.repository.js';

const COLETA: ColetaComServico = {
  id: 'coleta-1',
  servicoId: 'billing-api',
  servico: { id: 'billing-api', nome: 'Billing API' },
  coletadaAt: new Date('2026-10-13T10:30:00Z'),
  cpuPercent: 72.46 as never,
  memoryGb: 3.09 as never,
  diskGb: 18.39 as never,
  networkGb: 0.68 as never,
  potenciaW: 75.1681 as never,
  energiaKwh: 0.0012528017 as never,
  carbonIntensity: 85 as never,
  co2eG: 0.10648814 as never,
  status: 'ATIVO',
  erro: null,
  createdAt: new Date('2026-10-13T10:30:00Z'),
};

function criarController(coletas: Partial<ColetasRepository> = {}) {
  const repository = {
    listar: vi.fn().mockResolvedValue([]),
    ...coletas,
  };

  return {
    controller: new ColetasController(
      repository as unknown as ColetasRepository,
    ),
    repository,
  };
}

describe('ColetasController', () => {
  it('lista coletas com os valores decimais convertidos em números', async () => {
    const { controller, repository } = criarController({
      listar: vi.fn().mockResolvedValue([COLETA]),
    });

    const resposta = await controller.listar();

    expect(repository.listar).toHaveBeenCalledWith({
      servicoId: undefined,
      de: undefined,
      ate: undefined,
      limit: 50,
    });
    expect(resposta).toEqual([
      {
        id: 'coleta-1',
        servicoId: 'billing-api',
        servicoNome: 'Billing API',
        coletadaAt: COLETA.coletadaAt,
        cpuPercent: 72.46,
        memoryGb: 3.09,
        diskGb: 18.39,
        networkGb: 0.68,
        potenciaW: 75.1681,
        energiaKwh: 0.0012528017,
        carbonIntensity: 85,
        co2eG: 0.10648814,
        status: 'ATIVO',
        erro: null,
      },
    ]);
  });

  it('aplica os filtros servicoId, de, ate e limit', async () => {
    const { controller, repository } = criarController();

    await controller.listar(
      'billing-api',
      '2026-10-01T00:00:00Z',
      '2026-10-13T23:59:59Z',
      '10',
    );

    expect(repository.listar).toHaveBeenCalledWith({
      servicoId: 'billing-api',
      de: new Date('2026-10-01T00:00:00Z'),
      ate: new Date('2026-10-13T23:59:59Z'),
      limit: 10,
    });
  });

  it('rejeita limit não numérico ou fora do intervalo', async () => {
    const { controller } = criarController();

    await expect(controller.listar(undefined, undefined, undefined, 'abc')).rejects.toThrow(
      BadRequestException,
    );
    await expect(controller.listar(undefined, undefined, undefined, '0')).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      controller.listar(undefined, undefined, undefined, '5000'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejeita datas inválidas nos parâmetros de e ate', async () => {
    const { controller } = criarController();

    await expect(controller.listar(undefined, 'nao-e-data')).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      controller.listar(undefined, undefined, 'nao-e-data'),
    ).rejects.toThrow(BadRequestException);
  });

  it('retorna lista vazia quando o repositório não encontra coletas', async () => {
    const { controller } = criarController();

    await expect(controller.listar()).resolves.toEqual([]);
  });
});
