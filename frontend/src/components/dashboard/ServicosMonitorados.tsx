
"use client";

import {
  useDashboardData,
  type ImpactoServicoApi,
  type ServicoApi,
} from "./DashboardDataProvider";
import { Server } from "lucide-react";

interface Servico {
  id: string;
  nome: string;
  status: string;
  localizacao: string;
  energiaKwh: number;
  co2e: number;
}

const ESTILO_STATUS: Record<
  string,
  { rotulo: string; classe: string; corPonto: string }
> = {
  ATIVO: {
    rotulo: "Online",
    classe: "bg-[#E5F5E9] text-[#087443]",
    corPonto: "bg-[#159447]",
  },
  INDISPONIVEL: {
    rotulo: "Indisponível",
    classe: "bg-[#FFF0E5] text-[#A64B12]",
    corPonto: "bg-[#D97732]",
  },
  SEM_METRICAS: {
    rotulo: "Sem métricas",
    classe: "bg-[#FFF8E1] text-[#8A6D1F]",
    corPonto: "bg-[#C9A227]",
  },
};

const ESTILO_STATUS_DESCONHECIDO = {
  rotulo: "Desconhecido",
  classe: "bg-[#EEF2F0] text-[#52666A]",
  corPonto: "bg-[#8A9A96]",
};

function formatarLocalizacao(servico: ServicoApi): string {
  const partes = [servico.cidade, servico.regiao, servico.pais].filter(
    (parte): parte is string => Boolean(parte),
  );

  return partes.length > 0 ? partes.join(", ") : "—";
}

function combinarDados(
  servicos: ServicoApi[],
  impactos: ImpactoServicoApi[],
): Servico[] {
  const impactoPorServico = new Map(
    impactos.map((impacto) => [impacto.servicoId, impacto]),
  );

  return servicos
    .filter((servico) => servico.status !== "REMOVIDO")
    .map((servico) => {
      const impacto = impactoPorServico.get(servico.id);

      return {
        id: servico.id,
        nome: servico.nome,
        status: servico.status,
        localizacao: formatarLocalizacao(servico),
        energiaKwh: impacto?.energiaKwh ?? 0,
        co2e: impacto?.co2eG ?? 0,
      };
    });
}

export default function ServicosMonitorados() {
  const { servicos, impactos, carregando, erro, recarregar } =
    useDashboardData();

  const dados = combinarDados(servicos, impactos);

  return (
    <section
      id="servicos"
      className="group mt-6 min-w-0 rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md sm:mt-8 sm:p-6"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#18343C]">
            Serviços monitorados
          </h2>
          <p className="mt-1 text-sm text-[#718187]">
            Estado, localização e impacto ambiental por serviço
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
          <Server size={21} className="text-green-600" />
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
        >
          <span>{erro}</span>
          <button
            type="button"
            onClick={() => void recarregar()}
            className="rounded-lg border border-[#D97732] px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#D97732] hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#E5EDE7]">
        <table className="w-full min-w-[850px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="bg-[#F3F8F4] text-[#52666A]">
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">
                Serviço
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">
                Estado
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">
                Localização
              </th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider">
                Energia (kWh)
              </th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider">
                CO₂e (g)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8EFEA]">
            {carregando && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-[#718187]"
                >
                  Carregando serviços...
                </td>
              </tr>
            )}

            {!carregando &&
              dados.map((servico) => {
                const estilo =
                  ESTILO_STATUS[servico.status] ?? ESTILO_STATUS_DESCONHECIDO;

                return (
                  <tr
                    key={servico.id}
                    className="transition-colors duration-200 hover:bg-[#F5FAF6]"
                  >
                    <td className="px-5 py-4 font-semibold text-[#18343C]">
                      {servico.nome}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${estilo.classe}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${estilo.corPonto}`}
                        />
                        {estilo.rotulo}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#52666A]">
                      {servico.localizacao}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-[#18343C]">
                      {servico.energiaKwh.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-[#18343C]">
                      {servico.co2e.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                  </tr>
                );
              })}

            {!carregando && dados.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-[#718187]"
                >
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
