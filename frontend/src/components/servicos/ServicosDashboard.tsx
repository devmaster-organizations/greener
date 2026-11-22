"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, apiFetch } from "../../lib/api";
import DetalheServico from "./DetalheServico";
import ResumoServicos from "./ResumoServicos";
import type {
  ColetaApi,
  ImpactoServicoApi,
  ResumoServico,
  ServicoApi,
} from "./servicos.types";

interface DadosServicos {
  resumos: ResumoServico[];
  impactos: ImpactoServicoApi[];
}

async function buscarDados(): Promise<DadosServicos> {
  const [servicos, impactos] = await Promise.all([
    apiFetch<ServicoApi[]>("/servicos"),
    apiFetch<ImpactoServicoApi[]>("/dashboard/impacto-por-servico"),
  ]);

  const impactoPorServico = new Map(
    impactos.map((impacto) => [impacto.servicoId, impacto]),
  );

  const resumos = await Promise.all(
    servicos.map(async (servico): Promise<ResumoServico> => {
      const coletas = await apiFetch<ColetaApi[]>(
        `/coletas?servicoId=${encodeURIComponent(servico.id)}&limit=1`,
      ).catch(() => [] as ColetaApi[]);

      return {
        servico,
        ultimaColeta: coletas[0] ?? null,
        impacto: impactoPorServico.get(servico.id) ?? null,
      };
    }),
  );

  return { resumos, impactos };
}

function mensagemDeErro(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Não foi possível carregar os serviços.";
}

export default function ServicosDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicoId = searchParams.get("servicoId") ?? "";

  const [resumos, setResumos] = useState<ResumoServico[]>([]);
  const [impactos, setImpactos] = useState<ImpactoServicoApi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    buscarDados()
      .then((dados) => {
        if (ativo) {
          setResumos(dados.resumos);
          setImpactos(dados.impactos);
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
  }, []);

  const recarregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await buscarDados();

      setResumos(dados.resumos);
      setImpactos(dados.impactos);
    } catch (error) {
      setErro(mensagemDeErro(error));
    } finally {
      setCarregando(false);
    }
  };

  const selecionarServico = (id: string) => {
    router.push(
      id ? `/servicos?servicoId=${encodeURIComponent(id)}` : "/servicos",
    );
  };

  const resumoSelecionado =
    resumos.find((resumo) => resumo.servico.id === servicoId) ?? null;

  const valorFiltro = resumoSelecionado ? servicoId : "";

  return (
    <div>
      <section className="mb-8 rounded-xl border border-[#DCE8DF] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label
              htmlFor="filtro-servico"
              className="text-xs font-semibold uppercase tracking-wider text-[#52666A]"
            >
              Filtrar por serviço
            </label>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <select
                id="filtro-servico"
                value={valorFiltro}
                onChange={(event) => selecionarServico(event.target.value)}
                className="w-full min-w-[260px] rounded-lg border border-[#DCE8DF] bg-white px-4 py-2.5 text-sm text-[#18343C] outline-none transition focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/20 sm:w-auto"
              >
                <option value="">Todos os serviços</option>

                {resumos.map((resumo) => (
                  <option key={resumo.servico.id} value={resumo.servico.id}>
                    {resumo.servico.nome}
                  </option>
                ))}
              </select>

              {resumoSelecionado && (
                <button
                  type="button"
                  onClick={() => selecionarServico("")}
                  className="rounded-lg border border-[#DCE8DF] px-4 py-2.5 text-sm font-medium text-[#52666A] transition hover:border-[#159447] hover:text-[#064E2D]"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-[#52666A]">
            {carregando
              ? "Carregando serviços..."
              : `${resumos.length} serviço(s) monitorado(s)`}
          </p>
        </div>
      </section>

      {erro && (
        <div
          role="alert"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F3C7A8] bg-[#FFF7F1] px-4 py-3 text-sm text-[#A64B12]"
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
          Carregando serviços...
        </section>
      ) : resumoSelecionado ? (
        <DetalheServico
          key={resumoSelecionado.servico.id}
          servico={resumoSelecionado.servico}
          impacto={resumoSelecionado.impacto}
        />
      ) : servicoId ? (
        <section className="rounded-xl border border-[#DCE8DF] bg-white p-8 text-center text-sm text-[#52666A] shadow-sm">
          Serviço não encontrado.{" "}
          <Link
            href="/servicos"
            className="font-semibold text-[#159447] hover:text-[#064E2D]"
          >
            Ver todos os serviços
          </Link>
        </section>
      ) : (
        <ResumoServicos resumos={resumos} impactos={impactos} />
      )}
    </div>
  );
}
