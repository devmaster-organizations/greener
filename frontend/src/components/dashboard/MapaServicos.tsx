
"use client";

import dynamic from "next/dynamic";
import { MapPinned, MapPin } from "lucide-react";
import { useDashboardData, type ServicoApi } from "./DashboardDataProvider";
import type { ServicoMapa } from "./mapa-servicos.types";

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
      <div className="flex min-h-[380px] items-center justify-center bg-[#F3F8F4] text-sm text-[#52666A]">
        Carregando mapa...
      </div>
    ),
  },
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

export default function MapaServicos() {
  const { servicos, carregando, erro, recarregar } = useDashboardData();

  const dados = combinarDados(servicos);

  const quantidadeOnline = dados.filter(
    (servico) => servico.status === "Online",
  ).length;

  const quantidadeIndisponivel = dados.filter(
    (servico) => servico.status === "Indisponível",
  ).length;

  const quantidadeSemMetricas = dados.filter(
    (servico) => servico.status === "Sem métricas",
  ).length;

  return (
    <section className="group rounded-2xl border border-[#DCE8DF] bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#18343C]">
            Mapa de localização dos serviços
          </h2>
          <p className="mt-1 text-sm text-[#718187]">
            Distribuição geográfica dos serviços monitorados
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
          <MapPinned size={21} className="text-green-600" />
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
        >
          <span>{erro}</span>
          <button
            type="button"
            onClick={() => void recarregar()}
            className="rounded-lg border border-[#D97732] px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#D97732] hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E5EDE7] bg-[#F3F8F4] p-1.5">
        {carregando && (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-sm text-[#52666A]">
            <MapPin size={28} className="text-green-600" />
            Carregando serviços...
          </div>
        )}

        {!carregando && dados.length === 0 && (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <MapPin size={26} className="text-[#8A9A96]" />
            </div>
            <p className="font-semibold text-[#52666A]">
              Nenhum serviço com localização disponível
            </p>
            <p className="max-w-sm text-xs text-[#718187]">
              Quando houver serviços com coordenadas cadastradas, eles
              aparecerão nesta visualização.
            </p>
          </div>
        )}

        {!carregando && dados.length > 0 && (
          <Mapa dados={dados} />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#159447]" />
            <span className="text-xs font-medium text-[#52666A]">
              Online ({quantidadeOnline})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-medium text-[#52666A]">
              Indisponível ({quantidadeIndisponivel})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A227]" />
            <span className="text-xs font-medium text-[#52666A]">
              Sem métricas ({quantidadeSemMetricas})
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#718187]">
          {dados.length} {dados.length === 1 ? "localização" : "localizações"}
        </span>
      </div>
    </section>
  );
}
