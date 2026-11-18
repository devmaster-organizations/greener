"use client";

import { useDashboardData } from "./DashboardDataProvider";
import IndicadorCard from "./IndicadorCard";

function formatarEnergia(valor: number): string {
  return `${valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kWh`;
}

export default function IndicadorEnergia() {
  const { indicadores, carregando, erro } = useDashboardData();
  const energia = indicadores?.energiaTotalKwh ?? null;

  return (
    <IndicadorCard
      titulo="Energia estimada"
      valor={energia === null ? "—" : formatarEnergia(energia)}
      descricao={
        erro ??
        (carregando || energia === null
          ? "Carregando..."
          : "Consumo acumulado no período")
      }
    />
  );
}
