export interface ServicoDescoberto {
  id: string;
  nome: string;
  regionCode: string;
  pais: string;
  regiao: string;
  cidade: string;
  latitude: number;
  longitude: number;
  metricsPath: string;
}

interface ServicoAgregador {
  id: string;
  name: string;
  location: {
    region_code: string;
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  metrics_path: string;
}

export class AgregadorClient {
  constructor(
    private readonly baseUrl: string,
    private readonly http: typeof fetch = fetch,
  ) {}

  async listarServicos(): Promise<ServicoDescoberto[]> {
    const url = new URL('/services', this.baseUrl);

    const resposta = await this.http(url, {
      method: 'GET',
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
  }
}
