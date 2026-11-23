'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  CalendarDays,
  Leaf,
  Zap,
  AlertCircle,
  RefreshCw,
  Check,
  TrendingUp,
  Activity,
} from 'lucide-react';

type ServicoApi = {
  id: string;
  nome: string;
  status: string;
};

type ImpactoApi = {
  servicoId: string;
  servicoNome: string;
  energiaKwh: number;
  co2eG: number;
};

const CORES = ['#159447', '#72C879', '#347A55', '#8BBE9A', '#18343C'];

const formatarNumero = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 3,
  }).format(valor);

const formatarPercentual = (valor: number) =>
  `${formatarNumero(valor)}%`;

function useLarguraTela() {
  const [largura, setLargura] = useState(1024);

  useEffect(() => {
    function atualizarLargura() {
      setLargura(window.innerWidth);
    }

    atualizarLargura();
    window.addEventListener('resize', atualizarLargura);
    return () => window.removeEventListener('resize', atualizarLargura);
  }, []);

  return largura;
}

function CartaoIndicador({
  titulo,
  nome,
  valor,
  unidade,
  diferenca,
  tipo,
}: {
  titulo: string;
  nome: string;
  valor: number;
  unidade: string;
  diferenca: number | null;
  tipo: 'energia' | 'emissao';
}) {
  const Icone = tipo === 'energia' ? Zap : Leaf;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#EAF5EC] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
          <span className="text-sm font-medium text-[#52666A]">
            {titulo}
          </span>

          <div className="shrink-0 rounded-xl bg-[#EAF5EC] p-2.5 sm:p-3">
            <Icone className="h-5 w-5 text-[#159447]" />
          </div>
        </div>

        <p className="break-words text-lg font-bold text-[#18343C] sm:text-xl">
          {nome}
        </p>

        <p className="mt-2.5 text-2xl font-bold tracking-tight text-[#159447] sm:mt-3 sm:text-3xl">
          {formatarNumero(valor)}
          <span className="ml-2 text-sm font-medium text-[#52666A]">
            {unidade}
          </span>
        </p>

        {diferenca !== null && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[#DCE8DF] pt-3.5 text-xs text-[#52666A] sm:mt-5 sm:gap-2 sm:pt-4">
            <TrendingUp className="h-4 w-4 shrink-0 text-[#159447]" />
            <span>Diferença entre maior e menor:</span>
            <strong className="text-[#159447]">
              {formatarPercentual(diferenca)}
            </strong>
          </div>
        )}
      </div>
    </article>
  );
}

function TooltipPersonalizado({
  active,
  payload,
  unidade,
}: {
  active?: boolean;
  payload?: Array<{ payload: { servico: string; valor: number } }>;
  unidade: string;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="max-w-[240px] rounded-xl border border-[#DCE8DF] bg-white p-3.5 shadow-xl sm:p-4">
      <p className="break-words text-sm font-semibold text-[#18343C]">
        {item.servico}
      </p>
      <p className="mt-1 text-base font-bold text-[#159447] sm:text-lg">
        {formatarNumero(item.valor)} {unidade}
      </p>
    </div>
  );
}

type TipoGrafico = 'barras' | 'donut' | 'area';

function SeletorTipoGrafico({
  tipo,
  onChange,
}: {
  tipo: TipoGrafico;
  onChange: (tipo: TipoGrafico) => void;
}) {
  const opcoes: { valor: TipoGrafico; titulo: string }[] = [
    { valor: 'barras', titulo: 'Barras' },
    { valor: 'donut', titulo: 'Donut' },
    { valor: 'area', titulo: 'Área' },
  ];

  return (
    <div
      role="group"
      aria-label="Tipo de visualização do gráfico"
      className="flex w-full flex-wrap gap-1 rounded-xl border border-[#DCE8DF] bg-[#F7FAF7] p-1 sm:w-auto"
    >
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          onClick={() => onChange(opcao.valor)}
          aria-pressed={tipo === opcao.valor}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:flex-initial ${
            tipo === opcao.valor
              ? 'bg-[#159447] text-white shadow-sm'
              : 'text-[#52666A] hover:bg-[#EAF5EC] hover:text-[#159447]'
          }`}
        >
          {opcao.titulo}
        </button>
      ))}
    </div>
  );
}

function GraficoComparativo({
  dados,
  unidade,
  tipo,
}: {
  dados: { servico: string; valor: number }[];
  unidade: string;
  tipo: TipoGrafico;
}) {
  const [indiceAtivo, setIndiceAtivo] = useState<number | null>(null);
  const larguraTela = useLarguraTela();
  const isMobile = larguraTela < 640;

  if (dados.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#52666A]">
        Não há dados para exibir.
      </div>
    );
  }

  if (tipo === 'donut') {
    const total = dados.reduce((soma, item) => soma + item.valor, 0);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="servico"
            cx="50%"
            cy="43%"
            innerRadius={isMobile ? '48%' : '52%'}
            outerRadius={isMobile ? '68%' : '72%'}
            paddingAngle={3}
            cornerRadius={6}
            animationDuration={1100}
            animationEasing="ease-out"
            onMouseEnter={(_, index) => setIndiceAtivo(index)}
            onMouseLeave={() => setIndiceAtivo(null)}
          >
            {dados.map((item, index) => (
              <Cell
                key={item.servico}
                fill={CORES[index % CORES.length]}
                stroke="#FFFFFF"
                strokeWidth={indiceAtivo === index ? 5 : 2}
                opacity={
                  indiceAtivo === null || indiceAtivo === index
                    ? 1
                    : 0.45
                }
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 200ms, stroke-width 200ms',
                }}
              />
            ))}
          </Pie>

          <Tooltip
            content={<TooltipPersonalizado unidade={unidade} />}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{
              fontSize: '11px',
              paddingTop: '10px',
            }}
          />

          <text
            x="50%"
            y="41%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#18343C"
            fontSize={isMobile ? '16' : '20'}
            fontWeight="bold"
          >
            {formatarNumero(total)}
          </text>

          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#52666A"
            fontSize="11"
          >
            {unidade}
          </text>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (tipo === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={dados}
          margin={{
            top: 20,
            right: isMobile ? 12 : 25,
            left: isMobile ? -10 : 10,
            bottom: isMobile ? 65 : 55,
          }}
        >
          <defs>
            <linearGradient id="gradienteArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#159447" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#72C879" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#E8EFE9"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="servico"
            angle={isMobile ? -35 : -25}
            textAnchor="end"
            interval={dados.length > 6 && isMobile ? 'preserveStartEnd' : 0}
            height={isMobile ? 80 : 75}
            tick={{ fill: '#52666A', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#52666A', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            content={<TooltipPersonalizado unidade={unidade} />}
            cursor={{ stroke: '#159447', strokeDasharray: '4 4' }}
          />

          <Area
            type="linear"
            dataKey="valor"
            name="Valor"
            stroke="#159447"
            strokeWidth={3}
            fill="url(#gradienteArea)"
            fillOpacity={1}
            dot={{
              r: isMobile ? 4 : 5,
              fill: '#159447',
              stroke: '#FFFFFF',
              strokeWidth: 2,
            }}
            activeDot={{
              r: isMobile ? 6 : 8,
              fill: '#064E2D',
              stroke: '#FFFFFF',
              strokeWidth: 3,
            }}
            animationDuration={1100}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dados}
        layout="vertical"
        margin={{
          top: 5,
          right: isMobile ? 16 : 30,
          left: isMobile ? 4 : 15,
          bottom: 5,
        }}
      >
        <CartesianGrid
          stroke="#E8EFE9"
          strokeDasharray="4 4"
          horizontal={false}
        />

        <XAxis
          type="number"
          tick={{ fill: '#52666A', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="category"
          dataKey="servico"
          width={isMobile ? 92 : 130}
          tick={{ fill: '#18343C', fontSize: isMobile ? 10 : 11 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          cursor={{ fill: '#EAF5EC', opacity: 0.6 }}
          content={<TooltipPersonalizado unidade={unidade} />}
        />

        <Bar
          dataKey="valor"
          name="Valor"
          radius={[0, 8, 8, 0]}
          animationDuration={1100}
          animationEasing="ease-out"
        >
          {dados.map((item, index) => (
            <Cell
              key={item.servico}
              fill={CORES[index % CORES.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function ComparacoesClient() {
  const [servicos, setServicos] = useState<ServicoApi[]>([]);
  const [impactos, setImpactos] = useState<ImpactoApi[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [tipoGraficoEnergia, setTipoGraficoEnergia] =
    useState<TipoGrafico>('barras');

  const [tipoGraficoEmissoes, setTipoGraficoEmissoes] =
    useState<TipoGrafico>('barras');

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      if (dataInicial && dataFinal && dataInicial > dataFinal) {
        setErro('A data inicial não pode ser posterior à data final.');
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro('');

      try {
        const parametros = new URLSearchParams();

        if (dataInicial) parametros.set('de', dataInicial);
        if (dataFinal) parametros.set('ate', dataFinal);

        const consulta = parametros.toString();
        const caminho = `/dashboard/impacto-por-servico${
          consulta ? `?${consulta}` : ''
        }`;

        const [listaServicos, listaImpactos] = await Promise.all([
          apiFetch<ServicoApi[]>('/servicos'),
          apiFetch<ImpactoApi[]>(caminho),
        ]);

        if (!ativo) return;

        const disponiveis = listaServicos.filter(
          (servico) => servico.status !== 'REMOVIDO',
        );

        setServicos(disponiveis);
        setImpactos(listaImpactos);

        setSelecionados((atuais) => {
          const validos = atuais.filter((id) =>
            disponiveis.some((servico) => servico.id === id),
          );

          if (validos.length >= 2) return validos;

          return disponiveis.slice(0, 2).map((servico) => servico.id);
        });
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados.',
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [dataInicial, dataFinal]);

  const dadosSelecionados = useMemo(
    () =>
      impactos.filter((item) =>
        selecionados.includes(item.servicoId),
      ),
    [impactos, selecionados],
  );

  const maiorEnergia = useMemo(
    () =>
      [...dadosSelecionados].sort(
        (a, b) => Number(b.energiaKwh) - Number(a.energiaKwh),
      )[0],
    [dadosSelecionados],
  );

  const maiorEmissao = useMemo(
    () =>
      [...dadosSelecionados].sort(
        (a, b) => Number(b.co2eG) - Number(a.co2eG),
      )[0],
    [dadosSelecionados],
  );

  const dadosEnergia = useMemo(
    () =>
      dadosSelecionados
        .map((item) => ({
          servico: item.servicoNome,
          valor: Number(item.energiaKwh),
        }))
        .sort((a, b) => b.valor - a.valor),
    [dadosSelecionados],
  );

  const dadosEmissoes = useMemo(
    () =>
      dadosSelecionados
        .map((item) => ({
          servico: item.servicoNome,
          valor: Number(item.co2eG),
        }))
        .sort((a, b) => b.valor - a.valor),
    [dadosSelecionados],
  );

  function alternarServico(id: string) {
    setSelecionados((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id],
    );
  }

  function calcularDiferenca(
    dados: ImpactoApi[],
    campo: 'energiaKwh' | 'co2eG',
  ) {
    if (dados.length < 2) return null;

    const valores = dados.map((item) => Number(item[campo]));
    const maior = Math.max(...valores);
    const menor = Math.min(...valores);

    if (menor === 0) return null;

    return ((maior - menor) / menor) * 100;
  }

  const diferencaEnergia = calcularDiferenca(
    dadosSelecionados,
    'energiaKwh',
  );

  const diferencaEmissoes = calcularDiferenca(
    dadosSelecionados,
    'co2eG',
  );

  const energiaTotal = dadosSelecionados.reduce(
    (total, item) => total + Number(item.energiaKwh),
    0,
  );

  const emissaoTotal = dadosSelecionados.reduce(
    (total, item) => total + Number(item.co2eG),
    0,
  );

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Cabeçalho da análise */}
      <section className="relative overflow-hidden rounded-2xl bg-[#064E2D] p-5 text-white shadow-lg sm:p-7">
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-[#159447]/30 sm:right-40" />

        <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-5">
          <div className="min-w-0">
            <div className="mb-2.5 flex items-center gap-2 text-xs text-green-100 sm:mb-3 sm:text-sm">
              <Activity className="h-4 w-4 shrink-0" />
              Análise ambiental
            </div>

            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              Comparação de serviços
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-green-100">
              Analise o consumo energético e as emissões de carbono
              dos serviços monitorados.
            </p>
          </div>

          <div className="self-start rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 backdrop-blur-sm sm:p-4 md:self-auto">
            <p className="text-xs text-green-100">Serviços selecionados</p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">
              {selecionados.length}
              <span className="ml-2 text-sm font-normal text-green-100">
                / {servicos.length}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <div className="shrink-0 rounded-xl bg-[#EAF5EC] p-2.5">
            <CalendarDays className="h-5 w-5 text-[#159447]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#18343C]">
              Período da análise
            </h2>
            <p className="text-xs text-[#52666A]">
              Defina o intervalo que deseja consultar
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-[#52666A]">
            Data inicial
            <input
              type="date"
              value={dataInicial}
              onChange={(event) => setDataInicial(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#DCE8DF] bg-[#F7FAF7] p-3 text-sm text-[#18343C] outline-none transition focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/10"
            />
          </label>

          <label className="text-sm font-medium text-[#52666A]">
            Data final
            <input
              type="date"
              value={dataFinal}
              onChange={(event) => setDataFinal(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#DCE8DF] bg-[#F7FAF7] p-3 text-sm text-[#18343C] outline-none transition focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/10"
            />
          </label>
        </div>
      </section>

      {/* Seleção de serviços */}
      <section className="rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-[#EAF5EC] p-2.5">
              <BarChart3 className="h-5 w-5 text-[#159447]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#18343C]">
                Serviços para comparar
              </h2>
              <p className="text-xs text-[#52666A]">
                Escolha os serviços que deseja analisar
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setSelecionados(servicos.map((servico) => servico.id))
              }
              className="rounded-lg border border-[#159447] px-3 py-2 text-xs font-semibold text-[#159447] transition hover:bg-[#EAF5EC]"
            >
              Selecionar todos
            </button>

            <button
              type="button"
              onClick={() => setSelecionados([])}
              className="rounded-lg border border-[#DCE8DF] px-3 py-2 text-xs font-semibold text-[#52666A] transition hover:bg-gray-50"
            >
              Limpar
            </button>
          </div>
        </div>

        {servicos.length === 0 ? (
          <p className="text-sm text-[#52666A]">
            Nenhum serviço disponível para seleção.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico, index) => {
              const selecionado = selecionados.includes(servico.id);

              return (
                <label
                  key={servico.id}
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 sm:p-4 ${
                    selecionado
                      ? 'border-[#159447] bg-[#EAF5EC] shadow-sm'
                      : 'border-[#DCE8DF] bg-white hover:border-[#A3BFA8] hover:bg-[#F7FAF7]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selecionado}
                    onChange={() => alternarServico(servico.id)}
                    className="sr-only"
                  />

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      selecionado
                        ? 'bg-[#159447] text-white'
                        : 'bg-[#F0F4F0] text-[#52666A]'
                    }`}
                  >
                    {selecionado ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-bold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <span className="min-w-0 flex-1 break-words text-sm font-semibold text-[#18343C]">
                    {servico.nome}
                  </span>

                  {selecionado && (
                    <span className="shrink-0 rounded-full bg-[#159447]/15 px-2 py-0.5 text-[11px] font-medium text-[#159447]">
                      Ativo
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 border-t border-[#DCE8DF] pt-4 text-xs text-[#52666A]">
          <Activity className="h-4 w-4 shrink-0 text-[#159447]" />
          <span>
            Selecione pelo menos dois serviços para comparar os resultados.
          </span>
        </div>
      </section>

      {erro && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {carregando ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#DCE8DF] bg-white p-10 text-sm text-[#52666A] sm:p-14">
          <RefreshCw className="h-5 w-5 animate-spin text-[#159447]" />
          <span>Carregando dados da comparação...</span>
        </div>
      ) : !erro && selecionados.length < 2 ? (
        <div className="rounded-2xl border border-[#DCE8DF] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF5EC]">
            <BarChart3 className="h-7 w-7 text-[#159447]" />
          </div>
          <h3 className="font-semibold text-[#18343C]">
            Selecione mais serviços
          </h3>
          <p className="mt-2 text-sm text-[#52666A]">
            Escolha pelo menos dois serviços para visualizar os gráficos.
          </p>
        </div>
      ) : !erro && dadosSelecionados.length === 0 ? (
        <div className="rounded-2xl border border-[#DCE8DF] bg-white p-8 text-center text-sm text-[#52666A] sm:p-10">
          Não existem dados de impacto para os serviços selecionados neste período.
        </div>
      ) : !erro ? (
        <>
          {/* Indicadores */}
          <section className="grid gap-4 sm:grid-cols-2">
            <CartaoIndicador
              titulo="Maior consumo de energia"
              nome={maiorEnergia?.servicoNome ?? '—'}
              valor={Number(maiorEnergia?.energiaKwh ?? 0)}
              unidade="kWh"
              diferenca={diferencaEnergia}
              tipo="energia"
            />

            <CartaoIndicador
              titulo="Maior emissão de CO₂e"
              nome={maiorEmissao?.servicoNome ?? '—'}
              valor={Number(maiorEmissao?.co2eG ?? 0)}
              unidade="g"
              diferenca={diferencaEmissoes}
              tipo="emissao"
            />
          </section>

          {/* Totais selecionados */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-xl bg-[#EAF5EC] p-3">
                  <Zap className="h-5 w-5 text-[#159447]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#52666A]">
                    Energia total selecionada
                  </p>
                  <p className="break-words text-xl font-bold text-[#18343C] sm:text-2xl">
                    {formatarNumero(energiaTotal)}
                    <span className="ml-2 text-xs font-medium text-[#52666A]">
                      kWh
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-xl bg-[#EAF5EC] p-3">
                  <Leaf className="h-5 w-5 text-[#159447]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#52666A]">
                    Emissão total selecionada
                  </p>
                  <p className="break-words text-xl font-bold text-[#18343C] sm:text-2xl">
                    {formatarNumero(emissaoTotal)}
                    <span className="ml-2 text-xs font-medium text-[#52666A]">
                      g CO₂e
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Gráfico de energia */}
          <section className="rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-7 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#159447]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#159447]">
                    Eficiência energética
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#18343C] sm:text-lg">
                  Consumo por serviço
                </h2>
                <p className="mt-1 text-xs text-[#52666A] sm:text-sm">
                  Comparação do consumo de energia em kWh
                </p>
              </div>

              <SeletorTipoGrafico
                tipo={tipoGraficoEnergia}
                onChange={setTipoGraficoEnergia}
              />
            </div>

            <div className="h-[300px] w-full sm:h-[360px]">
              <GraficoComparativo
                dados={dadosEnergia}
                unidade="kWh"
                tipo={tipoGraficoEnergia}
              />
            </div>
          </section>

          {/* Gráfico de emissões */}
          <section className="rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-7 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#72C879]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#159447]">
                    Impacto ambiental
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#18343C] sm:text-lg">
                  Emissões por serviço
                </h2>
                <p className="mt-1 text-xs text-[#52666A] sm:text-sm">
                  Comparação das emissões de CO₂ equivalente em gramas
                </p>
              </div>

              <SeletorTipoGrafico
                tipo={tipoGraficoEmissoes}
                onChange={setTipoGraficoEmissoes}
              />
            </div>

            <div className="h-[300px] w-full sm:h-[360px]">
              <GraficoComparativo
                dados={dadosEmissoes}
                unidade="g CO₂e"
                tipo={tipoGraficoEmissoes}
              />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}