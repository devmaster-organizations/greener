"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiError, apiFetch } from "../../lib/api";
import {
  CLASSE_STATUS,
  CLASSE_STATUS_DESCONHECIDO,
  ROTULO_STATUS_COLETA,
  ROTULO_STATUS_SERVICO,
  formatarComUnidade,
  formatarDataHora,
  formatarDataHoraCurta,
  formatarLocalizacao,
  formatarNumero,
} from "../../lib/formatacao";
import type {
  ColetaApi,
  ImpactoServicoApi,
  ServicoApi,
} from "./servicos.types";

interface DetalheServicoProps {
  servico: ServicoApi;
  impacto: ImpactoServicoApi | null;
}

interface MetricaCardProps {
  titulo: string;
  valor: string;
}

function MetricaCard({ titulo, valor }: MetricaCardProps) {
  return (
    <article className="rounded-xl border border-[#DCE8DF] bg-white p-5 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#52666A]">
        {titulo}
      </h3>

      <p className="mt-2 text-2xl font-bold text-[#18343C]">{valor}</p>
    </article>
  );
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar as métricas do serviço.";
}

export default function DetalheServico({
  servico,
  impacto,
}: DetalheServicoProps) {
  const [coletas, setColetas] = useState<ColetaApi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarColetas = useCallback(async (): Promise<ColetaApi[]> => {
    return apiFetch<ColetaApi[]>(
      `/coletas?servicoId=${encodeURIComponent(servico.id)}&limit=30`,
    );
  }, [servico.id]);

  useEffect(() => {
    let ativo = true;

    buscarColetas()
      .then((dados) => {
        if (ativo) {
          setColetas(dados);
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
  }, [buscarColetas]);

  const recarregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      setColetas(await buscarColetas());
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  const ultimaColeta = coletas[0] ?? null;

  const dadosGrafico = useMemo(
    () =>
      [...coletas].reverse().map((coleta) => ({
        data: formatarDataHoraCurta(coleta.coletadaAt),
        cpu: coleta.cpuPercent,
        memoria: coleta.memoryGb,
        disco: coleta.diskGb,
      })),
    [coletas],
  );

  const rotuloStatus =
    ROTULO_STATUS_SERVICO[servico.status] ?? servico.status;
  const classeStatus =
    CLASSE_STATUS[servico.status] ?? CLASSE_STATUS_DESCONHECIDO;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-[#18343C]">
                {servico.nome}
              </h2>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classeStatus}`}
              >
                {rotuloStatus}
              </span>
            </div>

            <p className="mt-2 text-sm text-[#52666A]">
              {formatarLocalizacao(servico)}
            </p>

            <p className="mt-1 text-xs text-[#8A9A96]">
              Região {servico.regionCode} · Última coleta:{" "}
              {formatarDataHora(
                ultimaColeta?.coletadaAt ?? servico.ultimaColetaAt,
              )}
            </p>
          </div>

          <Link
            href="/servicos"
            className="font-semibold text-[#159447] transition-colors hover:text-[#064E2D]"
          >
            ← Ver todos os serviços
          </Link>
        </div>

        {impacto && (
          <div className="mt-5 flex flex-wrap gap-8 border-t border-[#E8EFEA] pt-4 text-sm text-[#52666A]">
            <span>
              Energia acumulada:{" "}
              <strong className="font-semibold text-[#18343C]">
                {formatarNumero(impacto.energiaKwh, 4)} kWh
              </strong>
            </span>

            <span>
              CO₂e acumulado:{" "}
              <strong className="font-semibold text-[#18343C]">
                {formatarNumero(impacto.co2eG, 2)} g
              </strong>
            </span>
          </div>
        )}
      </section>

      {erro && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
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

      {carregando ? (
        <section className="rounded-xl border border-[#DCE8DF] bg-white p-8 text-center text-sm text-[#52666A] shadow-sm">
          Carregando métricas do serviço...
        </section>
      ) : coletas.length === 0 ? (
        <section className="rounded-xl border border-[#DCE8DF] bg-white p-8 text-center text-sm text-[#52666A] shadow-sm">
          Nenhuma coleta registrada para este serviço.
        </section>
      ) : (
        <>
          <section
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Métricas da última coleta"
          >
            <MetricaCard
              titulo="CPU"
              valor={formatarComUnidade(
                ultimaColeta?.cpuPercent,
                1,
                "%",
                "",
              )}
            />

            <MetricaCard
              titulo="Memória"
              valor={formatarComUnidade(ultimaColeta?.memoryGb, 2, "GB")}
            />

            <MetricaCard
              titulo="Disco"
              valor={formatarComUnidade(ultimaColeta?.diskGb, 2, "GB")}
            />

            <MetricaCard
              titulo="Rede"
              valor={formatarComUnidade(ultimaColeta?.networkGb, 2, "GB")}
            />

            <MetricaCard
              titulo="Potência"
              valor={formatarComUnidade(ultimaColeta?.potenciaW, 2, "W")}
            />

            <MetricaCard
              titulo="Energia"
              valor={formatarComUnidade(ultimaColeta?.energiaKwh, 4, "kWh")}
            />

            <MetricaCard
              titulo="Intensidade de carbono"
              valor={formatarComUnidade(
                ultimaColeta?.carbonIntensity,
                2,
                "g/kWh",
              )}
            />

            <MetricaCard
              titulo="CO₂e"
              valor={formatarComUnidade(ultimaColeta?.co2eG, 3, "g")}
            />
          </section>

          <section
            className="grid grid-cols-1 gap-6 xl:grid-cols-2"
            aria-label="Histórico de métricas"
          >
            <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#18343C]">
                CPU ao longo do tempo
              </h2>

              <p className="mt-1 text-sm text-[#52666A]">
                Percentual de uso nas últimas {coletas.length} coletas
              </p>

              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E8EFEA"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="data"
                      tick={{ fontSize: 11, fill: "#52666A" }}
                      minTickGap={24}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#52666A" }}
                      unit="%"
                    />

                    <Tooltip
                      formatter={(value) => [
                        `${formatarNumero(Number(value), 1)}%`,
                        "CPU",
                      ]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #DCE8DF",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="cpu"
                      name="CPU"
                      stroke="#159447"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#18343C]">
                Memória e disco
              </h2>

              <p className="mt-1 text-sm text-[#52666A]">
                Uso em GB nas últimas {coletas.length} coletas
              </p>

              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E8EFEA"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="data"
                      tick={{ fontSize: 11, fill: "#52666A" }}
                      minTickGap={24}
                    />

                    <YAxis
                      tick={{ fontSize: 11, fill: "#52666A" }}
                      unit=" GB"
                    />

                    <Tooltip
                      formatter={(value, name) => [
                        `${formatarNumero(Number(value), 2)} GB`,
                        String(name),
                      ]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #DCE8DF",
                      }}
                    />

                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    <Line
                      type="monotone"
                      dataKey="memoria"
                      name="Memória"
                      stroke="#064E2D"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />

                    <Line
                      type="monotone"
                      dataKey="disco"
                      name="Disco"
                      stroke="#72C879"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </section>

          <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#18343C]">
                Coletas recentes
              </h2>

              <p className="mt-1 text-sm text-[#52666A]">
                Últimos registros recebidos para este serviço
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DCE8DF] text-[#52666A]">
                    <th className="px-4 py-3 font-medium">Data e hora</th>
                    <th className="px-4 py-3 text-right font-medium">CPU</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Memória
                    </th>
                    <th className="px-4 py-3 text-right font-medium">Disco</th>
                    <th className="px-4 py-3 text-right font-medium">Rede</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Potência
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Energia
                    </th>
                    <th className="px-4 py-3 text-right font-medium">CO₂e</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {coletas.map((coleta) => {
                    const rotulo =
                      ROTULO_STATUS_COLETA[coleta.status] ?? coleta.status;
                    const classe =
                      CLASSE_STATUS[coleta.status] ??
                      CLASSE_STATUS_DESCONHECIDO;

                    return (
                      <tr
                        key={coleta.id}
                        className="border-b border-[#E8EFEA] last:border-0 hover:bg-[#F7FAF7]"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-[#52666A]">
                          {formatarDataHora(coleta.coletadaAt)}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(
                            coleta.cpuPercent,
                            1,
                            "%",
                            "",
                          )}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(coleta.memoryGb, 2, "GB")}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(coleta.diskGb, 2, "GB")}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(coleta.networkGb, 2, "GB")}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(coleta.potenciaW, 2, "W")}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(coleta.energiaKwh, 4, "kWh")}
                        </td>

                        <td className="px-4 py-4 text-right text-[#18343C]">
                          {formatarComUnidade(coleta.co2eG, 3, "g")}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classe}`}
                            title={coleta.erro ?? undefined}
                          >
                            {rotulo}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
