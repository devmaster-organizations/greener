import { describe, expect, it, vi } from 'vitest';
import { AgregadorClient } from './agregador.client.js';

describe('AgregadorClient', () => {
  it('consulta /services e transforma os serviços para o formato interno', async () => {
    const respostaApi = [
      {
        id: 'billing-api',
        name: 'Billing API',
        location: {
          region_code: 'br-sudeste',
          country: 'Brazil',
          region: 'Sudeste',
          city: 'Sao Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
        },
        metrics_path: '/metrics/billing-api',
      },
      {
        id: 'checkout-worker',
        name: 'Checkout Worker',
        location: {
          region_code: 'us-east',
          country: 'United States',
          region: 'Virginia',
          city: 'Ashburn',
          latitude: 39.0438,
          longitude: -77.4874,
        },
        metrics_path: '/metrics/checkout-worker',
      },
    ];

    const fetchMock = vi.fn<typeof fetch>();

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(respostaApi), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    const servicos = await client.listarServicos();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, opcoes] = fetchMock.mock.calls[0]!;

    expect(String(url)).toBe('https://metrics.unilaunch.org/services');

    // fetch usa GET por padrão quando method não é informado.
    expect(opcoes?.method ?? 'GET').toBe('GET');

    expect(servicos).toEqual([
      {
        id: 'billing-api',
        nome: 'Billing API',
        regionCode: 'br-sudeste',
        pais: 'Brazil',
        regiao: 'Sudeste',
        cidade: 'Sao Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        metricsPath: '/metrics/billing-api',
      },
      {
        id: 'checkout-worker',
        nome: 'Checkout Worker',
        regionCode: 'us-east',
        pais: 'United States',
        regiao: 'Virginia',
        cidade: 'Ashburn',
        latitude: 39.0438,
        longitude: -77.4874,
        metricsPath: '/metrics/checkout-worker',
      },
    ]);
  });

  it('lança um erro quando o Agregador responde HTTP 503', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    // Mesmo com uma lista no corpo, o status indica falha.
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Falha ao consultar serviços: HTTP 503',
    );
  });

  it('rejeita uma resposta que não seja uma lista de serviços', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ services: [] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Resposta inválida do Agregador: esperada uma lista de serviços',
    );
  });
  it('rejeita um serviço sem metrics_path', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    const respostaApi = [
      {
        id: 'billing-api',
        name: 'Billing API',
        location: {
          region_code: 'br-sudeste',
          country: 'Brazil',
          region: 'Sudeste',
          city: 'Sao Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
        },
        // metrics_path ausente intencionalmente.
      },
    ];

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(respostaApi), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Resposta inválida do Agregador: serviço no índice 0',
    );
  });

  it('rejeita um serviço sem id', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    const respostaApi = [
      {
        // id ausente intencionalmente.
        name: 'Billing API',
        location: {
          region_code: 'br-sudeste',
          country: 'Brazil',
          region: 'Sudeste',
          city: 'Sao Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
        },
        metrics_path: '/metrics/billing-api',
      },
    ];

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(respostaApi), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Resposta inválida do Agregador: serviço no índice 0',
    );
  });

  it('rejeita um serviço sem location', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'billing-api',
            name: 'Billing API',
            metrics_path: '/metrics/billing-api',
          },
        ]),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Resposta inválida do Agregador: serviço no índice 0',
    );
  });

  it('rejeita um serviço sem region_code', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'billing-api',
            name: 'Billing API',
            location: {
              country: 'Brazil',
              region: 'Sudeste',
              city: 'Sao Paulo',
              latitude: -23.5505,
              longitude: -46.6333,
            },
            metrics_path: '/metrics/billing-api',
          },
        ]),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Resposta inválida do Agregador: serviço no índice 0',
    );
  });

  it('rejeita um serviço sem name', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'billing-api',
            location: {
              region_code: 'br-sudeste',
              country: 'Brazil',
              region: 'Sudeste',
              city: 'Sao Paulo',
              latitude: -23.5505,
              longitude: -46.6333,
            },
            metrics_path: '/metrics/billing-api',
          },
        ]),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).rejects.toThrow(
      'Resposta inválida do Agregador: serviço no índice 0',
    );
  });

  it('retorna uma lista vazia quando não há serviços', async () => {
    const fetchMock = vi.fn<typeof fetch>();

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const client = new AgregadorClient(
      'https://metrics.unilaunch.org',
      fetchMock,
    );

    await expect(client.listarServicos()).resolves.toEqual([]);
  });

  it('cancela a consulta quando excede o timeout', async () => {
    vi.useFakeTimers();

    try {
      const fetchMock = vi.fn<typeof fetch>();

      fetchMock.mockImplementation((_url, opcoes) => {
        return new Promise<Response>((_resolve, reject) => {
          const signal = opcoes?.signal;

          if (!signal) {
            reject(new Error('A requisição não recebeu um signal'));
            return;
          }

          signal.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Consulta cancelada', 'AbortError'));
            },
            { once: true },
          );
        });
      });

      const client = new AgregadorClient(
        'https://metrics.unilaunch.org',
        fetchMock,
        1000,
      );

      const resultado = client.listarServicos().then(
        (valor) => ({ valor, erro: undefined }),
        (erro: unknown) => ({ valor: undefined, erro }),
      );

      await vi.advanceTimersByTimeAsync(1000);

      const { erro } = await resultado;

      expect(erro).toBeInstanceOf(Error);
      expect((erro as Error).message).toBe(
        'Tempo limite excedido ao consultar serviços',
      );
    } finally {
      vi.useRealTimers();
    }
  });

  describe('coletarMetricas', () => {
    function resposta(status: number, corpo: unknown): Response {
      return new Response(JSON.stringify(corpo), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    it('retorna ATIVO com as métricas mapeadas (HTTP 200)', async () => {
      const fetchMock = vi.fn<typeof fetch>();

      fetchMock.mockResolvedValue(
        resposta(200, {
          collection_interval_seconds: 43,
          metrics: {
            cpu_percent: 72.46,
            memory_gb: 3.09,
            disk_gb: 18.39,
            network_gb: 0.68,
          },
        }),
      );

      const client = new AgregadorClient(
        'https://metrics.unilaunch.org',
        fetchMock,
      );

      await expect(client.coletarMetricas('billing-api')).resolves.toEqual({
        estado: 'ATIVO',
        intervaloColetaSegundos: 43,
        metricas: {
          cpuPercent: 72.46,
          memoryGb: 3.09,
          diskGb: 18.39,
          networkGb: 0.68,
        },
      });
    });

    it('retorna SEM_METRICAS quando não há métricas (HTTP 404)', async () => {
      const fetchMock = vi.fn<typeof fetch>();

      fetchMock.mockResolvedValue(
        resposta(404, {
          error: 'metrics_not_found',
          message: 'not available',
        }),
      );

      const client = new AgregadorClient(
        'https://metrics.unilaunch.org',
        fetchMock,
      );

      await expect(client.coletarMetricas('billing-api')).resolves.toEqual({
        estado: 'SEM_METRICAS',
      });
    });

    it('retorna INDISPONIVEL quando o serviço está indisponível (HTTP 500)', async () => {
      const fetchMock = vi.fn<typeof fetch>();

      fetchMock.mockResolvedValue(
        resposta(500, {
          error: 'service_unavailable',
          message: 'unavailable',
        }),
      );

      const client = new AgregadorClient(
        'https://metrics.unilaunch.org',
        fetchMock,
      );

      await expect(client.coletarMetricas('billing-api')).resolves.toEqual({
        estado: 'INDISPONIVEL',
      });
    });

    it('retorna INDISPONIVEL em falha de rede', async () => {
      const fetchMock = vi.fn<typeof fetch>();

      fetchMock.mockRejectedValue(new Error('falha de rede'));

      const client = new AgregadorClient(
        'https://metrics.unilaunch.org',
        fetchMock,
      );

      await expect(client.coletarMetricas('billing-api')).resolves.toEqual({
        estado: 'INDISPONIVEL',
      });
    });
  });
});
