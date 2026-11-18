export interface ServicoApi {
  id: string;
  nome: string;
  status: string;
  regionCode: string;
  pais: string | null;
  regiao: string | null;
  cidade: string | null;
  latitude: number | null;
  longitude: number | null;
  metricsPath: string;
  ultimaColetaAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ColetaApi {
  id: string;
  servicoId: string;
  servicoNome: string;
  coletadaAt: string;
  cpuPercent: number | null;
  memoryGb: number | null;
  diskGb: number | null;
  networkGb: number | null;
  potenciaW: number | null;
  energiaKwh: number | null;
  carbonIntensity: number | null;
  co2eG: number | null;
  status: string;
  erro: string | null;
}

export interface ImpactoServicoApi {
  servicoId: string;
  servicoNome: string;
  energiaKwh: number;
  co2eG: number;
}

export interface ResumoServico {
  servico: ServicoApi;
  ultimaColeta: ColetaApi | null;
  impacto: ImpactoServicoApi | null;
}
