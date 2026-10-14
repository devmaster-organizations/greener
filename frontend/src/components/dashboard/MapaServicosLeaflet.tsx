
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

interface ServicoMapa {
  id: number;
  nome: string;
  cidade: string;
  regiao: string;
  latitude: number;
  longitude: number;
  status: "Online" | "Indisponível";
}

interface MapaServicosLeafletProps {
  dados: ServicoMapa[];
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
            color:
              servico.status === "Online" ? "#087443" : "#D97732",
            fillColor:
              servico.status === "Online" ? "#159447" : "#F59E0B",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{servico.nome}</strong>
              <p>
                {servico.cidade}, {servico.regiao}
              </p>
              <p>
                Status: {servico.status}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
