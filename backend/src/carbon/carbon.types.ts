/**
 * Tipos no formato exposto pela API de Intensidade de Carbono
 * (https://carbon.unilaunch.org).
 */

export interface RespostaIntensidadeBruta {
  region_code: string;
  carbon_intensity_gco2e_per_kwh: number;
  renewable_share_percent?: number | null;
}

export interface IntensidadeCarbono {
  regionCode: string;
  carbonIntensityGco2ePorKwh: number;
  renewableSharePercent: number | null;
}
