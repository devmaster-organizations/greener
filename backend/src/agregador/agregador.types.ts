/**
 * Tipos no formato exposto pelo Agregador de Métricas
 * (https://metrics.unilaunch.org).
 */

export interface LocalizacaoAgregador {
  region_code: string;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ServicoAgregador {
  id: string;
  name: string;
  metrics_path: string;
  location?: LocalizacaoAgregador | null;
}

export interface MetricasBrutas {
  cpu_percent: number;
  memory_gb: number;
  disk_gb: number;
  network_gb: number;
}

export interface RespostaMetricasBruta {
  collection_interval_seconds: number;
  metrics: MetricasBrutas;
}

export interface RespostaErroBruta {
  error: string;
  message: string;
}
