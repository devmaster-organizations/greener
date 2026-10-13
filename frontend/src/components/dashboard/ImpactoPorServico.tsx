
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

interface ServicoImpacto {
  servico: string;
  co2e: number;
}

interface ImpactoPorServicoProps {
  dados: ServicoImpacto[];
}

export default function ImpactoPorServico({
  dados, //dados é uma propriedade do componente. Assim, os valores ficam separados do gráfico e poderão vir futuramente da API.
}: ImpactoPorServicoProps) {
  return (
    <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#18343C]">
        Impacto por serviço
      </h2>

      <p className="mt-1 text-sm text-[#52666A]">
        Emissões estimadas de CO₂e por serviço
      </p>

      <div className="mt-6 h-72 w-full">
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
              formatter={(value) => [`${value} g`, "CO₂e"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #DCE8DF",
              }}
            />

            <Bar
              dataKey="co2e"
              fill="#159447"
              radius={[6, 6, 0, 0]}
              maxBarSize={52}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
