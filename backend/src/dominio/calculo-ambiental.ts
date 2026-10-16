/**
 * Regras de estimativa do impacto ambiental de uma aplicação.
 *
 * As funções deste módulo são puras (sem I/O) para permitir testes unitários
 * que cubram valores esperados e situações de dados ausentes.
 */

export interface MetricasConsumo {
  cpuPercent: number;
  memoryGb: number;
  diskGb: number;
  networkGb: number;
}

/** Potência máxima estimada de um núcleo de CPU em uso pleno (W). */
export const POTENCIA_MAXIMA_CPU_W = 100;
/** Consumo estimado por GB de memória RAM (W/GB). */
export const FATOR_MEMORIA_W_POR_GB = 0.375;
/** Consumo estimado por GB de disco (W/GB). */
export const FATOR_DISCO_W_POR_GB = 0.01;
/** Consumo estimado por GB trafegado na rede (W/GB). */
export const FATOR_REDE_W_POR_GB = 0.02;

/**
 * Estima a potência (W) consumida a partir das métricas de uso de recursos.
 */
export function estimarPotenciaWatts(metricas: MetricasConsumo): number {
  return (
    (metricas.cpuPercent / 100) * POTENCIA_MAXIMA_CPU_W +
    metricas.memoryGb * FATOR_MEMORIA_W_POR_GB +
    metricas.diskGb * FATOR_DISCO_W_POR_GB +
    metricas.networkGb * FATOR_REDE_W_POR_GB
  );
}

/**
 * Estima a energia (kWh) consumida por uma potência (W) durante um intervalo.
 */
export function estimarEnergiaKwh(
  potenciaWatts: number,
  intervaloSegundos: number,
): number {
  return (potenciaWatts * intervaloSegundos) / 3600 / 1000;
}

/**
 * Estima a emissão (gCO2e) a partir da energia (kWh) e da intensidade
 * de carbono da região (gCO2e/kWh).
 */
export function estimarCo2eGramas(
  energiaKwh: number,
  intensidadeCarbonoGco2ePorKwh: number,
): number {
  return energiaKwh * intensidadeCarbonoGco2ePorKwh;
}
