"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "../../lib/api";

interface ColetaApi {
  id: string;
  servicoNome: string;
  coletadaAt: string;
  energiaKwh: number | null;
  co2eG: number | null;
  status: string;
}

interface Coleta {
  id: string;
  servico: string;
  dataHora: string;
  energiaKwh: number | null;
  co2e: number | null;
  status: string;
}

const ESTILO_STATUS: Record<string, { rotulo: string; classe: string }> = {
  ATIVO: {
    rotulo: "Concluída",
    classe: "bg-[#E5F5E9] text-[#087443]",
  },
  INDISPONIVEL: {
    rotulo: "Indisponível",
    classe: "bg-[#FFF0E5] text-[#A64B12]",
  },
  SEM_METRICAS: {
    rotulo: "Sem métricas",
    classe: "bg-[#FFF8E1] text-[#8A6D1F]",
  },
};

const ESTILO_STATUS_DESCONHECIDO = {
  rotulo: "Desconhecido",
  classe: "bg-[#EEF2F0] text-[#52666A]",
};

function formatarDataHora(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return data
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}

function formatarNumero(valor: number | null, casas: number): string {
  if (valor === null) {
    return "—";
  }

  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

function combinarDados(coletas: ColetaApi[]): Coleta[] {
  return coletas.map((coleta) => ({
    id: coleta.id,
    servico: coleta.servicoNome,
    dataHora: formatarDataHora(coleta.coletadaAt),
    energiaKwh: coleta.energiaKwh,
    co2e: coleta.co2eG,
    status: coleta.status,
  }));
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar as coletas recentes.";
}

export default function UltimasColetas() {
  const [dados, setDados] = useState<Coleta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarColetas = useCallback(async (): Promise<Coleta[]> => {
    const coletas = await apiFetch<ColetaApi[]>("/coletas?limit=10");

    return combinarDados(coletas);
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarColetas()
      .then((coletas) => {
        if (ativo) {
          setDados(coletas);
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
      setDados(await buscarColetas());
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#18343C]">
          Coletas recentes
        </h2>

        <p className="mt-1 text-sm text-[#52666A]">
          Últimos registros do monitoramento ambiental
        </p>
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
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#DCE8DF] text-[#52666A]">
              <th className="px-4 py-3 font-medium">Serviço</th>
              <th className="px-4 py-3 font-medium">Data e hora</th>
              <th className="px-4 py-3 text-right font-medium">
                Energia (kWh)
              </th>
              <th className="px-4 py-3 text-right font-medium">
                CO₂e (g)
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[#52666A]"
                >
                  Carregando coletas...
                </td>
              </tr>
            )}

            {!carregando &&
              dados.map((coleta) => {
                const estilo =
                  ESTILO_STATUS[coleta.status] ?? ESTILO_STATUS_DESCONHECIDO;

                return (
                  <tr
                    key={coleta.id}
                    className="border-b border-[#E8EFEA] last:border-0 hover:bg-[#F7FAF7]"
                  >
                    <td className="px-4 py-4 font-medium text-[#18343C]">
                      {coleta.servico}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-[#52666A]">
                      {coleta.dataHora}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {formatarNumero(coleta.energiaKwh, 4)}
                    </td>

                    <td className="px-4 py-4 text-right text-[#18343C]">
                      {formatarNumero(coleta.co2e, 3)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${estilo.classe}`}
                      >
                        {estilo.rotulo}
                      </span>
                    </td>
                  </tr>
                );
              })}

            {!carregando && dados.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[#52666A]"
                >
                  Nenhuma coleta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
