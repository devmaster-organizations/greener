"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, apiFetch } from "../../lib/api";

export interface IndicadoresApi {
  energiaTotalKwh: number;
  co2eTotalG: number;
  coletasRegistradas: number;
  servicosMonitorados: number;
  servicosIndisponiveis: number;
}

export interface HistoricoApi {
  dia: string;
  energiaKwh: number;
  co2eG: number;
}

export interface ImpactoServicoApi {
  servicoId: string;
  servicoNome: string;
  energiaKwh: number;
  co2eG: number;
}

export interface ServicoApi {
  id: string;
  nome: string;
  status: string;
  pais: string | null;
  regiao: string | null;
  cidade: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ColetaApi {
  id: string;
  servicoId: string;
  servicoNome: string;
  coletadaAt: string;
  energiaKwh: number | null;
  co2eG: number | null;
  status: string;
}

interface DadosDashboard {
  indicadores: IndicadoresApi | null;
  historico: HistoricoApi[];
  impactos: ImpactoServicoApi[];
  servicos: ServicoApi[];
  coletas: ColetaApi[];
}

interface DashboardDataValue extends DadosDashboard {
  carregando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
}

const DADOS_INICIAIS: DadosDashboard = {
  indicadores: null,
  historico: [],
  impactos: [],
  servicos: [],
  coletas: [],
};

const DashboardDataContext = createContext<DashboardDataValue | null>(null);

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar os dados do dashboard.";
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosDashboard>(DADOS_INICIAIS);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarDados = useCallback(async (): Promise<void> => {
    const resultados = await Promise.allSettled([
      apiFetch<IndicadoresApi>("/dashboard/indicadores"),
      apiFetch<HistoricoApi[]>("/dashboard/historico"),
      apiFetch<ImpactoServicoApi[]>("/dashboard/impacto-por-servico"),
      apiFetch<ServicoApi[]>("/servicos"),
      apiFetch<ColetaApi[]>("/coletas?limit=10"),
    ]);

    const [indicadores, historico, impactos, servicos, coletas] = resultados;

    setDados({
      indicadores: indicadores.status === "fulfilled" ? indicadores.value : null,
      historico: historico.status === "fulfilled" ? historico.value : [],
      impactos: impactos.status === "fulfilled" ? impactos.value : [],
      servicos: servicos.status === "fulfilled" ? servicos.value : [],
      coletas: coletas.status === "fulfilled" ? coletas.value : [],
    });

    const falha = resultados.find(
      (resultado) => resultado.status === "rejected",
    );

    setErro(
      falha?.status === "rejected" ? mensagemDeErro(falha.reason) : null,
    );
  }, []);

  const recarregar = useCallback(async (): Promise<void> => {
    setCarregando(true);
    setErro(null);

    try {
      await buscarDados();
    } finally {
      setCarregando(false);
    }
  }, [buscarDados]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const valor = useMemo<DashboardDataValue>(
    () => ({ ...dados, carregando, erro, recarregar }),
    [dados, carregando, erro, recarregar],
  );

  return (
    <DashboardDataContext.Provider value={valor}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData(): DashboardDataValue {
  const contexto = useContext(DashboardDataContext);

  if (!contexto) {
    throw new Error(
      "useDashboardData deve ser usado dentro de DashboardDataProvider",
    );
  }

  return contexto;
}
