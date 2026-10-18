
"use client";

import dynamic from "next/dynamic";

interface ServicoMapa {
  id: number;
  nome: string;
  cidade: string;
  regiao: string;
  latitude: number;
  longitude: number;
  status: "Online" | "Indisponível";
}

interface MapaServicosProps {
  dados: ServicoMapa[];
}

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

export default function MapaServicos({ dados }: MapaServicosProps) {
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

      <div className="min-h-[320px] overflow-hidden rounded-lg">
        <Mapa dados={dados} />
      </div>
    </section>
  );
}