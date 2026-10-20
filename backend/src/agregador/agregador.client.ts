import type {
  RespostaMetricasBruta,
  ResultadoMetricas,
  ServicoAgregador,
  ServicoDescoberto,
} from './agregador.types.js';

export type {
  RespostaMetricasBruta,
  ResultadoMetricas,
  ServicoAgregador,
  ServicoDescoberto,
} from './agregador.types.js';

export class AgregadorClient {
  constructor(
    private readonly baseUrl: string,
    private readonly http: typeof fetch = fetch,
    private readonly timeoutMs: number = 5000,
  ) {}

  async listarServicos(): Promise<ServicoDescoberto[]> {
    const url = new URL('/services', this.baseUrl);
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const resposta = await this.http(url, {
        method: 'GET',
        signal: controller.signal,
      });

      if (!resposta.ok) {
        throw new Error(`Falha ao consultar serviços: HTTP ${resposta.status}`);
      }

      const dados: unknown = await resposta.json();

      if (!Array.isArray(dados)) {
        throw new Error(
          'Resposta inválida do Agregador: esperada uma lista de serviços',
        );
      }

      const servicos = dados as ServicoAgregador[];

      return servicos.map((servico, index) => {
        if (
          typeof servico?.id !== 'string' ||
          servico.id.trim() === '' ||
          typeof servico?.name !== 'string' ||
          servico.name.trim() === '' ||
          typeof servico?.metrics_path !== 'string' ||
          servico.metrics_path.trim() === '' ||
          servico.location === null ||
          typeof servico.location !== 'object' ||
          Array.isArray(servico.location) ||
          typeof servico.location.region_code !== 'string' ||
          servico.location.region_code.trim() === ''
        ) {
          throw new Error(
            `Resposta inválida do Agregador: serviço no índice ${index}`,
          );
        }

        return {
          id: servico.id,
          nome: servico.name,
          regionCode: servico.location.region_code,
          pais: servico.location.country,
          regiao: servico.location.region,
          cidade: servico.location.city,
          latitude: servico.location.latitude,
          longitude: servico.location.longitude,
          metricsPath: servico.metrics_path,
        };
      });
    } catch (erro) {
      if (controller.signal.aborted) {
        throw new Error('Tempo limite excedido ao consultar serviços');
      }

      throw erro;
    } finally {
      clearTimeout(timer);
    }
  }

  async coletarMetricas(servicoId: string): Promise<ResultadoMetricas> {
    const url = new URL(
      `/metrics/${encodeURIComponent(servicoId)}`,
      this.baseUrl,
    );
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const resposta = await this.http(url, {
        method: 'GET',
        signal: controller.signal,
      });

      if (resposta.status === 200) {
        const dados = (await resposta.json()) as RespostaMetricasBruta;

        return {
          estado: 'ATIVO',
          intervaloColetaSegundos: dados.collection_interval_seconds,
          metricas: {
            cpuPercent: dados.metrics.cpu_percent,
            memoryGb: dados.metrics.memory_gb,
            diskGb: dados.metrics.disk_gb,
            networkGb: dados.metrics.network_gb,
          },
        };
      }

      if (resposta.status === 404) {
        return { estado: 'SEM_METRICAS' };
      }

      return { estado: 'INDISPONIVEL' };
    } catch {
      return { estado: 'INDISPONIVEL' };
    } finally {
      clearTimeout(timer);
    }
  }
}
