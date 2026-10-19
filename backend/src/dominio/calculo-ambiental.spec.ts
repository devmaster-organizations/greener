import { describe, expect, it } from 'vitest';
import {
  estimarCo2eGramas,
  estimarEnergiaKwh,
  estimarPotenciaWatts,
} from './calculo-ambiental.js';

describe('Estimativas ambientais', () => {
  it('estima a potência a partir das métricas de uso', () => {
    // 50% de 100 W + 2 GB * 0,375 + 10 GB * 0,01 + 1 GB * 0,02 = 50,87 W
    const potencia = estimarPotenciaWatts({
      cpuPercent: 50,
      memoryGb: 2,
      diskGb: 10,
      networkGb: 1,
    });

    expect(potencia).toBeCloseTo(50.87, 4);
  });

  it('estima a energia (kWh) para um intervalo de 60 segundos', () => {
    const energia = estimarEnergiaKwh(50.87, 60);
    expect(energia).toBeCloseTo(0.0008478333, 9);
  });

  it('estima a emissão de CO2e a partir da energia e da região', () => {
    const co2e = estimarCo2eGramas(0.0008478333, 85);
    expect(co2e).toBeCloseTo(0.0720658, 6);
  });

  it('retorna zero quando não há uso de recursos', () => {
    const potencia = estimarPotenciaWatts({
      cpuPercent: 0,
      memoryGb: 0,
      diskGb: 0,
      networkGb: 0,
    });

    expect(potencia).toBe(0);
    expect(estimarEnergiaKwh(0, 60)).toBe(0);
    expect(estimarCo2eGramas(0, 85)).toBe(0);
  });

  it('não gera energia nem emissão sem intervalo de tempo', () => {
    expect(estimarEnergiaKwh(50.87, 0)).toBe(0);
  });
});
