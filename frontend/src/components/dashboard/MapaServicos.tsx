"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApiError, apiFetch } from "../../lib/api";
import type { ServicoMapa } from "./mapa-servicos.types";

interface ServicoApi {
  id: string;
  nome: string;
  status: string;
  cidade: string | null;
  regiao: string | null;
  latitude: number | null;
  longitude: number | null;
}

const ROTULO_STATUS: Record<string, string> = {
  ATIVO: "Online",
  INDISPONIVEL: "Indisponível",
  SEM_METRICAS: "Sem métricas",
};

const Mapa = dynamic(
  () => import("./MapaServicosLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] items-center justify-center bg-[#F7FAF7] text-sm text-[#52666A]">
        Carregando mapa...
      </div>
    ),
  }
);

function combinarDados(servicos: ServicoApi[]): ServicoMapa[] {
  return servicos
    .filter((servico) => servico.status !== "REMOVIDO")
    .flatMap((servico) => {
      if (servico.latitude === null || servico.longitude === null) {
        return [];
      }

      return [
        {
          id: servico.id,
          nome: servico.nome,
          cidade: servico.cidade ?? "",
          regiao: servico.regiao ?? "",
          latitude: servico.latitude,
          longitude: servico.longitude,
          status: ROTULO_STATUS[servico.status] ?? "Desconhecido",
        },
      ];
    });
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar o mapa de serviços.";
}

export default function MapaServicos() {
  const [dados, setDados] = useState<ServicoMapa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarServicos = useCallback(async (): Promise<ServicoMapa[]> => {
    const servicos = await apiFetch<ServicoApi[]>("/servicos");

    return combinarDados(servicos);
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarServicos()
      .then((servicos) => {
        if (ativo) {
          setDados(servicos);
        }
      })
      .catch((error: unknown) => {
        if (ativo) {
          setErro(mensagemDeErro(error));
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [buscarServicos]);

  const recarregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      setDados(await buscarServicos());
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#18343C]">
          Mapa de localização dos serviços
        </h2>

        <p className="mt-1 text-sm text-[#52666A]">
          Distribuição geográfica dos serviços monitorados
        </p>
      </div>

      {erro && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
        >
          <span>{erro}</span>

          <button
            type="button"
            onClick={() => void recarregar()}
            className="rounded-md border border-[#D97732] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#D97732] hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="min-h-[320px] overflow-hidden rounded-lg">
        {carregando && (
          <div className="flex min-h-[320px] items-center justify-center bg-[#F7FAF7] text-sm text-[#52666A]">
            Carregando serviços...
          </div>
        )}

        {!carregando && dados.length === 0 && (
          <div className="flex min-h-[320px] items-center justify-center bg-[#F7FAF7] text-sm text-[#52666A]">
            Nenhum serviço com localização disponível.
          </div>
        )}

        {!carregando && dados.length > 0 && <Mapa dados={dados} />}
      </div>
    </section>
  );
}
