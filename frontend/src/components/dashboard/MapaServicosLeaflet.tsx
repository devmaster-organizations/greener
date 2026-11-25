
"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import type { ServicoMapa } from "./mapa-servicos.types";

interface MapaServicosLeafletProps {
  dados: ServicoMapa[];
}

function estiloStatus(status: string) {
  if (status === "Online") {
    return {
      color: "#FFFFFF",
      fillColor: "#159447",
    };
  }

  if (status === "Sem métricas") {
    return {
      color: "#FFFFFF",
      fillColor: "#C9A227",
    };
  }

  return {
    color: "#FFFFFF",
    fillColor: "#E07832",
  };
}

function AjustarVisualizacao({ dados }: MapaServicosLeafletProps) {
  const mapa = useMap();

  useEffect(() => {
    if (dados.length === 0) return;

    const pontos = dados.map(
      (servico) =>
        [servico.latitude, servico.longitude] as [number, number],
    );

    if (pontos.length === 1) {
      mapa.setView(pontos[0], 6, { animate: true });
    } else {
      mapa.fitBounds(pontos, {
        padding: [45, 45],
        maxZoom: 6,
        animate: true,
      });
    }
  }, [dados, mapa]);

  return null;
}

export default function MapaServicosLeaflet({
  dados,
}: MapaServicosLeafletProps) {
  const centroBrasil: LatLngExpression = [-14.235, -51.9253];

  return (
        <MapContainer
      center={centroBrasil}
      zoom={4}
      scrollWheelZoom
      className="h-[260px] w-full rounded-xl sm:h-[380px]"
    >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />


      <AjustarVisualizacao dados={dados} />

      {dados.map((servico) => (
        <CircleMarker
          key={servico.id}
          center={[servico.latitude, servico.longitude]}
          radius={10}
          pathOptions={{
            ...estiloStatus(servico.status),
            fillOpacity: 0.95,
            opacity: 1,
            weight: 3,
          }}
          bubblingMouseEvents={false}
        >
          <Popup>
            <div className="min-w-[180px] p-1 text-sm">
              <strong className="block text-base font-bold text-[#18343C]">
                {servico.nome}
              </strong>

              <div className="my-2 h-px bg-[#E5EDE7]" />

              <p className="text-[#52666A]">
                <span className="font-semibold">Localização:</span>
                <br />
                {[servico.cidade, servico.regiao]
                  .filter(Boolean)
                  .join(", ") || "Não informada"}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    servico.status === "Online"
                      ? "bg-[#159447]"
                      : servico.status === "Sem métricas"
                        ? "bg-[#C9A227]"
                        : "bg-[#E07832]"
                  }`}
                />

                <span className="font-semibold text-[#18343C]">
                  {servico.status}
                </span>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
