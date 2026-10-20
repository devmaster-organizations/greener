import type { MetricasConsumo } from '../dominio/calculo-ambiental.js';

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

/**
 * Resultado da coleta de métricas de um serviço.
 *
 * - `ATIVO`: métricas obtidas com sucesso (HTTP 200).
 * - `SEM_METRICAS`: serviço listado, mas sem métricas disponíveis (HTTP 404).
 * - `INDISPONIVEL`: serviço indisponível ou falha de rede (HTTP 500 / timeout).
 */
export type ResultadoMetricas =
  | {
      estado: 'ATIVO';
      intervaloColetaSegundos: number;
      metricas: MetricasConsumo;
    }
  | { estado: 'SEM_METRICAS'; erro: string }
  | { estado: 'INDISPONIVEL'; erro: string };

export interface RespostaMetricasBruta {
  collection_interval_seconds: number;
  metrics: {
    cpu_percent: number;
    memory_gb: number;
    disk_gb: number;
    network_gb: number;
  };
}

export interface ServicoAgregador {
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
