"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardData } from "./DashboardDataProvider";
import { TrendingUp } from "lucide-react";

function formatarDia(dia: string): string {
  const partes = dia.slice(0, 10).split("-");

  if (partes.length !== 3) {
    return dia;
  }

  return `${partes[2]}/${partes[1]}`;
}

export default function HistoricoImpacto() {
  const { historico, carregando, erro, recarregar } = useDashboardData();

  const dados = historico.map((item) => ({
    data: formatarDia(item.dia),
    co2e: item.co2eG,
  }));

  return (
      <section className="group rounded-2xl border border-[#DCE8DF] bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#18343C]">
              Histórico de impacto
            </h2>

            <p className="mt-1 text-sm text-[#718187]">
              Evolução das emissões estimadas de CO₂e
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <TrendingUp size={21} className="text-green-600" />
          </div>
        </div>

      {erro && (
        <div
          role="alert"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
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

      <div className="mt-8 h-72 w-full">
        {carregando && (
          <div className="flex h-full items-center justify-center text-sm text-[#52666A]">
            Carregando histórico...
          </div>
        )}

        {!carregando && dados.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-[#52666A]">
            Sem dados de coletas no período.
          </div>
        )}

        {!carregando && dados.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dados}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#E5EDE7"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="data"
                tick={{ fill: "#52666A", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#52666A", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} g`,
                  "CO₂e",
                ]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  border: "1px solid #DCE8DF",
                  boxShadow: "0 8px 24px rgba(24, 52, 60, 0.10)",
                  padding: "12px 16px",
                }}
                labelStyle={{
                  color: "#18343C",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
                itemStyle={{
                  color: "#159447",
                  fontSize: 13,
                  fontWeight: 600,
                }}
                cursor={{ stroke: "#A7D8B5", strokeDasharray: "4 4" }}
              />

              <Line
                type="monotone"
                dataKey="co2e"
                stroke="#159447"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#FFFFFF",
                  stroke: "#159447",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "#159447",
                  stroke: "#FFFFFF",
                  strokeWidth: 3,
                }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
