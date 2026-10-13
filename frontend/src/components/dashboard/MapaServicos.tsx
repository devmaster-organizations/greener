
"use client";

import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";

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

export default function MapaServicos({ dados }: MapaServicosProps) {
  const [Mapa, setMapa] = useState<React.ComponentType<{
    dados: ServicoMapa[];
  }> | null>(null);

  useEffect(() => {
    import("./MapaServicosLeaflet").then((modulo) => {
      setMapa(() => modulo.default);
    });
  }, []);

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
        {Mapa ? (
          <Mapa dados={dados} />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center bg-[#F7FAF7] text-sm text-[#52666A]">
            Carregando mapa...
          </div>
        )}
      </div>
    </section>
  );
}
