"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiError, apiFetch } from "../../lib/api";

interface ImpactoServicoApi {
  servicoId: string;
  servicoNome: string;
  energiaKwh: number;
  co2eG: number;
}

interface ServicoImpacto {
  servico: string;
  co2e: number;
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar o impacto por serviço.";
}

export default function ImpactoPorServico() {
  const [dados, setDados] = useState<ServicoImpacto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarImpactos = useCallback(async (): Promise<ServicoImpacto[]> => {
    const impactos = await apiFetch<ImpactoServicoApi[]>(
      "/dashboard/impacto-por-servico",
    );

    return impactos.map((impacto) => ({
      servico: impacto.servicoNome,
      co2e: impacto.co2eG,
    }));
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarImpactos()
      .then((impactos) => {
        if (ativo) {
          setDados(impactos);
        }
      })
      .catch((error: unknown) => {
        if (ativo) {
          setErro(mensagemDeErro(error));
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [buscarImpactos]);

  const recarregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      setDados(await buscarImpactos());
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#18343C]">
        Impacto por serviço
      </h2>

      <p className="mt-1 text-sm text-[#52666A]">
        Emissões estimadas de CO₂e por serviço
      </p>

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
        )}
      </div>
    </section>
  );
}
