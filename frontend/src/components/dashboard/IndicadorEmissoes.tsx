
"use client";

import { Leaf } from "lucide-react";
import { useDashboardData } from "./DashboardDataProvider";
import IndicadorCard from "./IndicadorCard";

function formatarEmissoes(valorEmGramas: number): string {
  const valorEmKg = valorEmGramas / 1000;

  return `${valorEmKg.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kg`;
}

export default function IndicadorEmissoes() {
  const { indicadores, carregando, erro } = useDashboardData();
  const emissoes = indicadores?.co2eTotalG ?? null;

  return (
    <IndicadorCard
      titulo="Emissões de CO₂e"
      valor={emissoes === null ? "—" : formatarEmissoes(emissoes)}
      descricao={
        erro ??
        (carregando || emissoes === null
          ? "Carregando..."
          : "Emissões estimadas de carbono")
      }
      corDestaque="border-t-green-500"
      icone={<Leaf size={23} className="text-green-600" />}
    />
  );
}
