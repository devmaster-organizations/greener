"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "../../lib/api";
import IndicadorCard from "./IndicadorCard";

interface IndicadoresApi {
  energiaTotalKwh: number;
}

function formatarEnergia(valor: number): string {
  return `${valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kWh`;
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar a energia estimada.";
}

export default function IndicadorEnergia() {
  const [energia, setEnergia] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscarEnergia = useCallback(async (): Promise<number> => {
    const indicadores = await apiFetch<IndicadoresApi>(
      "/dashboard/indicadores",
    );

    return indicadores.energiaTotalKwh;
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarEnergia()
      .then((valor) => {
        if (ativo) {
          setEnergia(valor);
        }
      })
      .catch((error: unknown) => {
        if (ativo) {
          setErro(mensagemDeErro(error));
        }
      });

    return () => {
      ativo = false;
    };
  }, [buscarEnergia]);

  return (
    <IndicadorCard
      titulo="Energia estimada"
      valor={energia === null ? "—" : formatarEnergia(energia)}
      descricao={
        erro ??
        (energia === null
          ? "Carregando..."
          : "Consumo acumulado no período")
      }
    />
  );
}
