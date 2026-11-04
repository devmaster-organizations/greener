"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "../../lib/api";
import IndicadorCard from "./IndicadorCard";

interface IndicadoresApi {
  co2eTotalG: number;
}

function formatarEmissoes(valorEmGramas: number): string {
  const valorEmKg = valorEmGramas / 1000;

  return `${valorEmKg.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kg`;
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar as emissões de CO₂e.";
}

export default function IndicadorEmissoes() {
  const [emissoes, setEmissoes] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscarEmissoes = useCallback(async (): Promise<number> => {
    const indicadores = await apiFetch<IndicadoresApi>(
      "/dashboard/indicadores",
    );

    return indicadores.co2eTotalG;
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarEmissoes()
      .then((valor) => {
        if (ativo) {
          setEmissoes(valor);
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
  }, [buscarEmissoes]);

  return (
    <IndicadorCard
      titulo="Emissões de CO₂e"
      valor={emissoes === null ? "—" : formatarEmissoes(emissoes)}
      descricao={
        erro ??
        (emissoes === null
          ? "Carregando..."
          : "Emissões estimadas de carbono")
      }
    />
  );
}
