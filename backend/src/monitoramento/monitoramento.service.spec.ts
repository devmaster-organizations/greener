import { describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AgregadorClient } from '../agregador/agregador.client.js';
import type { ServicoDescoberto } from '../agregador/agregador.client.js';
import { CarbonClient } from '../carbon/carbon.client.js';
import { ColetasRepository } from '../coletas/coletas.repository.js';
import { ServicosRepository } from '../servicos/servicos.repository.js';
import { MonitoramentoService } from './monitoramento.service.js';

const SERVICO: ServicoDescoberto = {
  id: 'billing-api',
  nome: 'Billing API',
  regionCode: 'br-sudeste',
  pais: 'Brazil',
  regiao: 'Sudeste',
  cidade: 'Sao Paulo',
  latitude: -23.5505,
  longitude: -46.6333,
  metricsPath: '/metrics/billing-api',
};

const METRICAS_ATIVO = {
  estado: 'ATIVO' as const,
  intervaloColetaSegundos: 60,
  metricas: { cpuPercent: 50, memoryGb: 2, diskGb: 10, networkGb: 1 },
};

function criarServico() {
  const agregador = {
    listarServicos: vi.fn().mockResolvedValue([SERVICO]),
    coletarMetricas: vi.fn().mockResolvedValue(METRICAS_ATIVO),
  };
  const carbon = {
    obterIntensidade: vi.fn().mockResolvedValue({
      regionCode: 'br-sudeste',
      carbonIntensityGco2ePorKwh: 85,
      renewableSharePercent: 83,
    }),
  };
  const servicos = {
    salvar: vi.fn().mockResolvedValue(undefined),
    atualizarStatus: vi.fn().mockResolvedValue(undefined),
    marcarRemovidosExceto: vi.fn().mockResolvedValue(0),
  };
  const coletas = { registrar: vi.fn().mockResolvedValue(undefined) };
  const scheduler = {
    addInterval: vi.fn(),
    deleteInterval: vi.fn(),
    doesExist: vi.fn().mockReturnValue(false),
  };
  const config = { get: (_chave: string, padrao?: unknown) => padrao };

  const service = new MonitoramentoService(
    config as unknown as ConfigService,
    agregador as unknown as AgregadorClient,
    carbon as unknown as CarbonClient,
    servicos as unknown as ServicosRepository,
    coletas as unknown as ColetasRepository,
    scheduler as unknown as SchedulerRegistry,
  );

  return { service, agregador, carbon, servicos, coletas, scheduler };
}

describe('MonitoramentoService', () => {
  it('persiste a coleta e calcula energia e CO2e de um serviço ativo', async () => {
    const { service, agregador, servicos, coletas } = criarServico();

    await service.executarCiclo();

    expect(agregador.listarServicos).toHaveBeenCalledTimes(1);
    expect(servicos.salvar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'billing-api',
        nome: 'Billing API',
        regionCode: 'br-sudeste',
        metricsPath: '/metrics/billing-api',
        latitude: -23.5505,
        longitude: -46.6333,
      }),
    );

    const coleta = coletas.registrar.mock.calls[0][0];
    expect(coleta).toMatchObject({ servicoId: 'billing-api', status: 'ATIVO' });
    expect(coleta.potenciaW).toBeCloseTo(50.87, 4);
    expect(coleta.energiaKwh).toBeCloseTo(0.0008478333, 9);
    expect(coleta.carbonIntensity).toBe(85);
    expect(coleta.co2eG).toBeCloseTo(0.0720658, 6);
    expect(coleta.erro).toBeUndefined();

    expect(servicos.atualizarStatus).toHaveBeenCalledWith(
      'billing-api',
      'ATIVO',
      expect.any(Date),
    );
    expect(servicos.marcarRemovidosExceto).toHaveBeenCalledWith(['billing-api']);
  });

  it('classifica o serviço como INDISPONIVEL quando a coleta retorna 500', async () => {
    const { service, agregador, servicos, coletas } = criarServico();
    agregador.coletarMetricas.mockResolvedValue({
      estado: 'INDISPONIVEL',
      erro: 'HTTP 500 — serviço indisponível',
    });

    await service.executarCiclo();

    expect(coletas.registrar).toHaveBeenCalledWith(
      expect.objectContaining({
        servicoId: 'billing-api',
        status: 'INDISPONIVEL',
        erro: 'HTTP 500 — serviço indisponível',
      }),
    );
    expect(servicos.atualizarStatus).toHaveBeenCalledWith(
      'billing-api',
      'INDISPONIVEL',
      expect.any(Date),
    );
  });

  it('classifica o serviço como SEM_METRICAS quando a coleta retorna 404', async () => {
    const { service, agregador, servicos, coletas } = criarServico();
    agregador.coletarMetricas.mockResolvedValue({
      estado: 'SEM_METRICAS',
      erro: 'HTTP 404 — métricas não disponíveis',
    });

    await service.executarCiclo();

    expect(coletas.registrar).toHaveBeenCalledWith(
      expect.objectContaining({
        servicoId: 'billing-api',
        status: 'SEM_METRICAS',
        erro: 'HTTP 404 — métricas não disponíveis',
      }),
    );
    expect(servicos.atualizarStatus).toHaveBeenCalledWith(
      'billing-api',
      'SEM_METRICAS',
      expect.any(Date),
    );
  });

  it('registra a coleta mesmo sem intensidade de carbono disponível', async () => {
    const { service, carbon, coletas } = criarServico();
    carbon.obterIntensidade.mockResolvedValue(null);

    await service.executarCiclo();

    const coleta = coletas.registrar.mock.calls[0][0];
    expect(coleta.status).toBe('ATIVO');
    expect(coleta.carbonIntensity).toBeNull();
    expect(coleta.co2eG).toBeNull();
  });

  it('encerra o ciclo sem alterações quando o agregador falha ao listar', async () => {
    const { service, agregador, servicos, coletas } = criarServico();
    agregador.listarServicos.mockRejectedValue(new Error('agregador fora'));

    await expect(service.executarCiclo()).resolves.toBeUndefined();

    expect(servicos.salvar).not.toHaveBeenCalled();
    expect(coletas.registrar).not.toHaveBeenCalled();
    expect(servicos.marcarRemovidosExceto).not.toHaveBeenCalled();
  });

  it('não sobrepõe ciclos concorrentes', async () => {
    const { service, agregador } = criarServico();
    let resolver!: (servicos: ServicoDescoberto[]) => void;
    agregador.listarServicos.mockReturnValue(
      new Promise<ServicoDescoberto[]>((resolve) => {
        resolver = resolve;
      }),
    );

    const primeiro = service.executarCiclo();
    await service.executarCiclo();

    expect(agregador.listarServicos).toHaveBeenCalledTimes(1);

    resolver([]);
    await primeiro;
  });
});
