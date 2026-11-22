"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardData } from "./DashboardDataProvider";
import { Leaf } from "lucide-react";

export default function ImpactoPorServico() {
  const { impactos, carregando, erro, recarregar } = useDashboardData();

  const dados = impactos.map((impacto) => ({
    servico: impacto.servicoNome,
    co2e: impacto.co2eG,
  }));

  return (
      <section className="group rounded-2xl border border-[#DCE8DF] bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#18343C]">
            Impacto por serviço
          </h2>

          <p className="mt-1 text-sm text-[#718187]">
            Emissões estimadas de CO₂e por serviço
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
          <Leaf size={21} className="text-green-600" />
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

      <div className="mt-6 h-72 w-full">
        {carregando && (
          <div className="flex h-full items-center justify-center text-sm text-[#52666A]">
            Carregando impacto por serviço...
          </div>
        )}

        {!carregando && dados.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-[#52666A]">
            Sem dados de coletas no período.
          </div>
        )}

        {!carregando && dados.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dados}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#E5EDE7"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="servico"
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
                cursor={{ fill: "#F0F7F1" }}
              />

              <Bar
                dataKey="co2e"
                fill="#159447"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
                activeBar={{ fill: "#117A3B" }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
