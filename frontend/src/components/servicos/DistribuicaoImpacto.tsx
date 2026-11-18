"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatarNumero } from "../../lib/formatacao";
import type { ImpactoServicoApi } from "./servicos.types";

const CORES = [
  "#064E2D",
  "#159447",
  "#2FA35C",
  "#72C879",
  "#A8DDAE",
  "#C9A227",
  "#D97732",
  "#8A9A96",
];

interface DistribuicaoImpactoProps {
  impactos: ImpactoServicoApi[];
}

export default function DistribuicaoImpacto({
  impactos,
}: DistribuicaoImpactoProps) {
  const dados = impactos
    .filter((impacto) => impacto.co2eG > 0)
    .map((impacto) => ({
      nome: impacto.servicoNome,
      valor: impacto.co2eG,
    }));

  return (
    <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#18343C]">
        Distribuição de CO₂e
      </h2>

      <p className="mt-1 text-sm text-[#52666A]">
        Participação de cada serviço nas emissões acumuladas
      </p>

      <div className="mt-6 h-80 w-full">
        {dados.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#52666A]">
            Sem dados de emissões.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                dataKey="valor"
                nameKey="nome"
                innerRadius={58}
                outerRadius={100}
                paddingAngle={2}
              >
                {dados.map((entrada, indice) => (
                  <Cell
                    key={entrada.nome}
                    fill={CORES[indice % CORES.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${formatarNumero(Number(value), 2)} g`,
                  "CO₂e",
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #DCE8DF",
                }}
              />

              <Legend
                wrapperStyle={{ fontSize: 12, color: "#52666A" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
