"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiError, apiFetch } from "../../lib/api";

interface HistoricoApi {
  dia: string;
  energiaKwh: number;
  co2eG: number;
}

interface PontoHistorico {
  data: string;
  co2e: number;
}

function formatarDia(dia: string): string {
  const partes = dia.slice(0, 10).split("-");

  if (partes.length !== 3) {
    return dia;
  }

  return `${partes[2]}/${partes[1]}`;
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar o histórico de impacto.";
}

export default function HistoricoImpacto() {
  const [dados, setDados] = useState<PontoHistorico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarHistorico = useCallback(async (): Promise<PontoHistorico[]> => {
    const historico = await apiFetch<HistoricoApi[]>("/dashboard/historico");

    return historico.map((item) => ({
      data: formatarDia(item.dia),
      co2e: item.co2eG,
    }));
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarHistorico()
      .then((historico) => {
        if (ativo) {
          setDados(historico);
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
  }, [buscarHistorico]);

  const recarregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      setDados(await buscarHistorico());
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#18343C]">
        Histórico de impacto
      </h2>

      <p className="mt-1 text-sm text-[#52666A]">
        Evolução das emissões estimadas de CO₂e
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
        )}
      </div>
    </section>
  );
}
