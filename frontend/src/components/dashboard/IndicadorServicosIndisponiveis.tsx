"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "../../lib/api";
import IndicadorCard from "./IndicadorCard";

interface IndicadoresApi {
  servicosIndisponiveis: number;
}

function formatarQuantidade(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar os serviços indisponíveis.";
}

export default function IndicadorServicosIndisponiveis() {
  const [quantidade, setQuantidade] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscarQuantidade = useCallback(async (): Promise<number> => {
    const indicadores = await apiFetch<IndicadoresApi>(
      "/dashboard/indicadores",
    );

    return indicadores.servicosIndisponiveis;
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarQuantidade()
      .then((valor) => {
        if (ativo) {
          setQuantidade(valor);
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
  }, [buscarQuantidade]);

  return (
    <IndicadorCard
      titulo="Serviços indisponíveis"
      valor={quantidade === null ? "—" : formatarQuantidade(quantidade)}
      descricao={
        erro ??
        (quantidade === null ? "Carregando..." : "Serviços sem resposta")
      }
    />
  );
}
