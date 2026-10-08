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

    expect(String(url)).toBe(
      'https://metrics.unilaunch.org/services',
    );

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
});