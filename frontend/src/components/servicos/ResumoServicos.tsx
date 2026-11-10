"use client";

import Link from "next/link";
import {
  CLASSE_STATUS,
  CLASSE_STATUS_DESCONHECIDO,
  ROTULO_STATUS_SERVICO,
  formatarComUnidade,
  formatarDataHora,
  formatarLocalizacao,
  formatarNumero,
} from "../../lib/formatacao";
import DistribuicaoImpacto from "./DistribuicaoImpacto";
import type { ImpactoServicoApi, ResumoServico } from "./servicos.types";

interface ResumoServicosProps {
  resumos: ResumoServico[];
  impactos: ImpactoServicoApi[];
}

interface CartaoResumoProps {
  titulo: string;
  valor: string;
  descricao: string;
}

function CartaoResumo({ titulo, valor, descricao }: CartaoResumoProps) {
  return (
    <article className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-[#52666A]">{titulo}</h3>

      <p className="mt-3 text-3xl font-bold text-[#18343C]">{valor}</p>

      <p className="mt-2 text-xs text-[#8A9A96]">{descricao}</p>
    </article>
  );
}

export default function ResumoServicos({
  resumos,
  impactos,
}: ResumoServicosProps) {
  const totalMonitorados = resumos.length;
  const totalOnline = resumos.filter(
    (resumo) => resumo.servico.status === "ATIVO",
  ).length;
  const totalIndisponiveis = resumos.filter(
    (resumo) => resumo.servico.status === "INDISPONIVEL",
  ).length;

  const energiaTotal = impactos.reduce(
    (total, impacto) => total + impacto.energiaKwh,
    0,
  );
  const co2eTotal = impactos.reduce(
    (total, impacto) => total + impacto.co2eG,
    0,
  );

  const ranking = impactos
    .filter((impacto) => impacto.co2eG > 0)
    .slice(0, 6);
  const maiorEmissao = ranking[0]?.co2eG ?? 0;

  return (
    <div className="space-y-8">
      <section
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Resumo dos serviços"
      >
        <CartaoResumo
          titulo="Serviços monitorados"
          valor={String(totalMonitorados)}
          descricao="Serviços cadastrados no monitoramento"
        />

        <CartaoResumo
          titulo="Online"
          valor={String(totalOnline)}
          descricao="Coletando métricas normalmente"
        />

        <CartaoResumo
          titulo="Indisponíveis"
          valor={String(totalIndisponiveis)}
          descricao="Sem resposta na última coleta"
        />

        <CartaoResumo
          titulo="Emissões totais"
          valor={`${formatarNumero(co2eTotal / 1000, 2)} kg`}
          descricao="CO₂e acumulado em todas as coletas"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DistribuicaoImpacto impactos={impactos} />

        <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#18343C]">
            Maiores emissões
          </h2>

          <p className="mt-1 text-sm text-[#52666A]">
            Energia acumulada: {formatarNumero(energiaTotal, 4)} kWh
          </p>

          {ranking.length === 0 ? (
            <div className="mt-6 flex h-64 items-center justify-center text-sm text-[#52666A]">
              Sem dados de emissões.
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {ranking.map((impacto) => (
                <li key={impacto.servicoId}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-medium text-[#18343C]">
                      {impacto.servicoNome}
                    </span>

                    <span className="whitespace-nowrap text-[#52666A]">
                      {formatarNumero(impacto.co2eG, 2)} g
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-[#EEF2F0]">
                    <div
                      className="h-2 rounded-full bg-[#159447]"
                      style={{
                        width: `${
                          maiorEmissao > 0
                            ? Math.max(
                                (impacto.co2eG / maiorEmissao) * 100,
                                2,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <section className="rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#18343C]">
            Todos os serviços
          </h2>

          <p className="mt-1 text-sm text-[#52666A]">
            Selecione um serviço para ver o histórico completo de métricas
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#DCE8DF] text-[#52666A]">
                <th className="px-4 py-3 font-medium">Serviço</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Última coleta</th>
                <th className="px-4 py-3 text-right font-medium">CPU</th>
                <th className="px-4 py-3 text-right font-medium">Memória</th>
                <th className="px-4 py-3 text-right font-medium">
                  Energia (kWh)
                </th>
                <th className="px-4 py-3 text-right font-medium">CO₂e (g)</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {resumos.map((resumo) => {
                const { servico, ultimaColeta, impacto } = resumo;
                const rotulo =
                  ROTULO_STATUS_SERVICO[servico.status] ?? servico.status;
                const classe =
                  CLASSE_STATUS[servico.status] ?? CLASSE_STATUS_DESCONHECIDO;

                return (
                  <tr
                    key={servico.id}
                    className="border-b border-[#E8EFEA] last:border-0 hover:bg-[#F7FAF7]"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#18343C]">
                        {servico.nome}
                      </p>

                      <p className="mt-1 text-xs text-[#8A9A96]">
                        {formatarLocalizacao(servico)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classe}`}
                      >
                        {rotulo}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-[#52666A]">
                      {formatarDataHora(
                        ultimaColeta?.coletadaAt ?? servico.ultimaColetaAt,
                      )}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {formatarComUnidade(
                        ultimaColeta?.cpuPercent,
                        1,
                        "%",
                        "",
                      )}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {formatarComUnidade(ultimaColeta?.memoryGb, 2, "GB")}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {formatarNumero(impacto?.energiaKwh, 4)}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {formatarNumero(impacto?.co2eG, 2)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <Link
                        href={`/servicos?servicoId=${encodeURIComponent(
                          servico.id,
                        )}`}
                        className="font-semibold text-[#159447] transition-colors hover:text-[#064E2D]"
                      >
                        Detalhes →
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {resumos.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-[#52666A]"
                  >
                    Nenhum serviço cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
