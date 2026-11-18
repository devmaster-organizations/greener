"use client";

import { useDashboardData } from "./DashboardDataProvider";
import IndicadorCard from "./IndicadorCard";

function formatarQuantidade(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

export default function IndicadorServicosMonitorados() {
  const { indicadores, carregando, erro } = useDashboardData();
  const quantidade = indicadores?.servicosMonitorados ?? null;

  return (
    <IndicadorCard
      titulo="Serviços monitorados"
      valor={quantidade === null ? "—" : formatarQuantidade(quantidade)}
      descricao={
        erro ??
        (carregando || quantidade === null
          ? "Carregando..."
          : "Serviços identificados")
      }
    />
  );
}
