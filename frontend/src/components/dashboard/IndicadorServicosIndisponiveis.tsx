
"use client";

import { AlertCircle } from "lucide-react";
import { useDashboardData } from "./DashboardDataProvider";
import IndicadorCard from "./IndicadorCard";

function formatarQuantidade(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

export default function IndicadorServicosIndisponiveis() {
  const { indicadores, carregando, erro } = useDashboardData();
  const quantidade = indicadores?.servicosIndisponiveis ?? null;

  return (
    <IndicadorCard
      titulo="Serviços indisponíveis"
      valor={quantidade === null ? "—" : formatarQuantidade(quantidade)}
      descricao={
        erro ??
        (carregando || quantidade === null
          ? "Carregando..."
          : "Serviços sem resposta")
      }
      corDestaque="border-t-red-500"
      icone={<AlertCircle size={23} className="text-red-500" />}
    />
  );
}
