
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

interface HistoricoImpactoProps {
  dados: {
    data: string;
    co2e: number;
  }[];
}

export default function HistoricoImpacto({
  dados,
}: HistoricoImpactoProps) {
  return (
    <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#18343C]">
        Histórico de impacto
      </h2>

      <p className="mt-1 text-sm text-[#52666A]">
        Evolução das emissões estimadas de CO₂e
      </p>

      <div className="mt-6 h-72 w-full">
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
              formatter={(value) => [`${value} g`, "CO₂e"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #DCE8DF",
              }}
            />

            <Line
              type="monotone"
              dataKey="co2e"
              stroke="#159447"
              strokeWidth={3}
              dot={{ r: 4, fill: "#159447" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
