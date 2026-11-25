
"use client";

import { Server } from "lucide-react";
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
      corDestaque="border-t-blue-500"
      icone={<Server size={23} className="text-blue-600" />}
    />
  );
}
