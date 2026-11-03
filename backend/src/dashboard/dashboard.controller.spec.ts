import { describe, expect, it, vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { ColetasRepository } from '../coletas/coletas.repository.js';
import { ServicosRepository } from '../servicos/servicos.repository.js';
import { DashboardController } from './dashboard.controller.js';

function criarController(
  coletas: Partial<ColetasRepository> = {},
  servicos: Partial<ServicosRepository> = {},
) {
  const repositorioColetas = {
    somarTotais: vi.fn().mockResolvedValue({
      energiaKwh: 0,
      co2eG: 0,
      coletas: 0,
    }),
    co2ePorDia: vi.fn().mockResolvedValue([]),
    agruparPorServico: vi.fn().mockResolvedValue([]),
    ...coletas,
  };

  const repositorioServicos = {
    contarMonitorados: vi.fn().mockResolvedValue(0),
    contarIndisponiveis: vi.fn().mockResolvedValue(0),
    ...servicos,
  };

  return {
    controller: new DashboardController(
      repositorioColetas as unknown as ColetasRepository,
      repositorioServicos as unknown as ServicosRepository,
    ),
    coletas: repositorioColetas,
    servicos: repositorioServicos,
  };
}

describe('DashboardController', () => {
  it('agrega energia, CO2e e contagens em /dashboard/indicadores', async () => {
    const { controller, coletas, servicos } = criarController(
      {
        somarTotais: vi.fn().mockResolvedValue({
          energiaKwh: 12.8,
          co2eG: 1093.5,
          coletas: 42,
        }),
      },
      {
        contarMonitorados: vi.fn().mockResolvedValue(8),
        contarIndisponiveis: vi.fn().mockResolvedValue(1),
      },
    );

    await expect(controller.indicadores()).resolves.toEqual({
      energiaTotalKwh: 12.8,
      co2eTotalG: 1093.5,
      coletasRegistradas: 42,
      servicosMonitorados: 8,
      servicosIndisponiveis: 1,
    });

    expect(coletas.somarTotais).toHaveBeenCalledWith({
      de: undefined,
      ate: undefined,
    });
    expect(servicos.contarMonitorados).toHaveBeenCalledTimes(1);
    expect(servicos.contarIndisponiveis).toHaveBeenCalledTimes(1);
  });

  it('repassa o período informado para o agregado de indicadores', async () => {
    const { controller, coletas } = criarController();

    await controller.indicadores('2026-10-01T00:00:00Z', '2026-10-13T00:00:00Z');

    expect(coletas.somarTotais).toHaveBeenCalledWith({
      de: new Date('2026-10-01T00:00:00Z'),
      ate: new Date('2026-10-13T00:00:00Z'),
    });
  });

  it('rejeita período inválido em /dashboard/indicadores', async () => {
    const { controller } = criarController();

    await expect(controller.indicadores('xxx')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('retorna o histórico diário de CO2e', async () => {
    const { controller, coletas } = criarController({
      co2ePorDia: vi.fn().mockResolvedValue([
        { dia: '2026-10-12', energiaKwh: 0.065, co2eG: 54.8 },
        { dia: '2026-10-13', energiaKwh: 0.071, co2eG: 60.3 },
      ]),
    });

    await expect(controller.historico()).resolves.toEqual([
      { dia: '2026-10-12', energiaKwh: 0.065, co2eG: 54.8 },
      { dia: '2026-10-13', energiaKwh: 0.071, co2eG: 60.3 },
    ]);
    expect(coletas.co2ePorDia).toHaveBeenCalledWith({
      de: undefined,
      ate: undefined,
    });
  });

  it('retorna o impacto agregado por serviço', async () => {
    const { controller, coletas } = criarController({
      agruparPorServico: vi.fn().mockResolvedValue([
        {
          servicoId: 'billing-api',
          servicoNome: 'Billing API',
          energiaKwh: 2.84,
          co2eG: 241.4,
        },
      ]),
    });

    await expect(controller.impactoPorServico()).resolves.toEqual([
      {
        servicoId: 'billing-api',
        servicoNome: 'Billing API',
        energiaKwh: 2.84,
        co2eG: 241.4,
      },
    ]);
    expect(coletas.agruparPorServico).toHaveBeenCalledWith({
      de: undefined,
      ate: undefined,
    });
  });
});
