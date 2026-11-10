"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "../../lib/api";

interface ServicoApi {
  id: string;
  nome: string;
  status: string;
  pais: string | null;
  regiao: string | null;
  cidade: string | null;
}

interface ImpactoServicoApi {
  servicoId: string;
  energiaKwh: number;
  co2eG: number;
}

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

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar os serviços monitorados.";
}

export default function ServicosMonitorados() {
  const [dados, setDados] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarServicos = useCallback(async (): Promise<Servico[]> => {
    const [servicos, impactos] = await Promise.all([
      apiFetch<ServicoApi[]>("/servicos"),
      apiFetch<ImpactoServicoApi[]>("/dashboard/impacto-por-servico"),
    ]);

    return combinarDados(servicos, impactos);
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarServicos()
      .then((servicos) => {
        if (ativo) {
          setDados(servicos);
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
  }, [buscarServicos]);

  const recarregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      setDados(await buscarServicos());
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#18343C]">
            Serviços monitorados
          </h2>

          <p className="mt-1 text-sm text-[#52666A]">
            Estado, localização e impacto ambiental por serviço
          </p>
        </div>

        <Link
          href="/servicos"
          className="text-sm font-semibold text-[#159447] transition-colors hover:text-[#064E2D]"
        >
          Ver todos os serviços →
        </Link>
      </div>

      {erro && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#DCE8DF] text-[#52666A]">
              <th className="px-4 py-3 font-medium">Serviço</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Localização</th>
              <th className="px-4 py-3 text-right font-medium">
                Energia (kWh)
              </th>
              <th className="px-4 py-3 text-right font-medium">
                CO₂e (g)
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[#52666A]"
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
                    className="border-b border-[#E8EFEA] last:border-0 hover:bg-[#F7FAF7]"
                  >
                    <td className="px-4 py-4 font-medium text-[#18343C]">
                      {servico.nome}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${estilo.classe}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${estilo.corPonto}`}
                        />
                        {estilo.rotulo}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-[#52666A]">
                      {servico.localizacao}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {servico.energiaKwh.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {servico.co2e.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })}
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

            {!carregando && dados.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[#52666A]"
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
