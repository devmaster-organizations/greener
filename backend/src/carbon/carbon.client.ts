import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  IntensidadeCarbono,
  RespostaIntensidadeBruta,
} from './carbon.types.js';

/**
 * Cliente da API de Intensidade de Carbono.
 *
 * A intensidade é praticamente estática por região, então os valores são
 * cacheados em memória para evitar consultas repetidas a cada ciclo.
 */
@Injectable()
export class CarbonClient {
  private readonly logger = new Logger(CarbonClient.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly cache = new Map<string, IntensidadeCarbono>();

  constructor(@Inject(ConfigService) config: ConfigService) {
    this.baseUrl = config
      .get<string>('CARBON_BASE_URL', 'https://carbon.unilaunch.org')
      .replace(/\/+$/, '');
    this.timeoutMs = Number(config.get('AGREGADOR_TIMEOUT_MS') ?? 5000);
  }

  /**
   * Retorna a intensidade de carbono de uma região, ou `null` se a região
   * não for encontrada ou a API falhar.
   */
  async obterIntensidade(
    regionCode: string,
  ): Promise<IntensidadeCarbono | null> {
    const emCache = this.cache.get(regionCode);
    if (emCache) {
      return emCache;
    }

    let resposta: Response;
    try {
      resposta = await this.buscar(
        `/regions/${encodeURIComponent(regionCode)}/carbon-intensity`,
      );
    } catch (erro) {
      this.logger.warn(
        `Falha ao consultar carbono de "${regionCode}": ${String(erro)}`,
      );
      return null;
    }

    if (!resposta.ok) {
      this.logger.warn(
        `Carbono respondeu ${resposta.status} para a região "${regionCode}"`,
      );
      return null;
    }

    const corpo = (await resposta.json()) as RespostaIntensidadeBruta;
    const intensidade: IntensidadeCarbono = {
      regionCode: corpo.region_code,
      carbonIntensityGco2ePorKwh: corpo.carbon_intensity_gco2e_per_kwh,
      renewableSharePercent: corpo.renewable_share_percent ?? null,
    };
    this.cache.set(regionCode, intensidade);

    return intensidade;
  }

  private async buscar(caminho: string): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      return await fetch(`${this.baseUrl}${caminho}`, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }
}
