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
    return { color: "#087443", fillColor: "#159447" };
  }

  if (status === "Sem métricas") {
    return { color: "#8A6D1F", fillColor: "#C9A227" };
  }

  return { color: "#A64B12", fillColor: "#F59E0B" };
}

function AjustarVisualizacao({ dados }: MapaServicosLeafletProps) {
  const mapa = useMap();

  useEffect(() => {
    if (dados.length === 0) return;

    const pontos = dados.map(
      (servico) =>
        [servico.latitude, servico.longitude] as [number, number]
    );

    if (pontos.length === 1) {
      mapa.setView(pontos[0], 6);
    } else {
      mapa.fitBounds(pontos, { padding: [35, 35], maxZoom: 6 });
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
      className="h-[320px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarVisualizacao dados={dados} />

      {dados.map((servico) => (
        <CircleMarker
          key={servico.id}
          center={[servico.latitude, servico.longitude]}
          radius={9}
          pathOptions={{
            ...estiloStatus(servico.status),
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{servico.nome}</strong>
              <p>
                {[servico.cidade, servico.regiao].filter(Boolean).join(", ") ||
                  "Localização não informada"}
              </p>
              <p>Status: {servico.status}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
