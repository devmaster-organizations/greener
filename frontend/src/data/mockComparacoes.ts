
/**
 * Dados fictícios para a funcionalidade de comparação entre serviços.
 *
 * IMPORTANTE:
 * Estes dados são utilizados somente durante o desenvolvimento da tela.
 * Os serviços e identificadores abaixo NÃO representam registros reais
 * do banco de dados.
 *
 * A estrutura foi preparada para facilitar a futura integração com o backend.
 */

export interface ServicoComparacao {
  id: string;
  nome: string;
  cor: string;
}

export interface HistoricoComparacao {
  servicoId: string;
  data: string;
  energiaKwh: number;
  co2eG: number;
}

/**
 * Serviços disponíveis para seleção no modal de comparação.
 *
 * IDs fictícios: serão substituídos pelos IDs retornados pela API.
 */
export const MOCK_SERVICOS: ServicoComparacao[] = [
  {
    id: "mock-servico-1",
    nome: "API de Usuários",
    cor: "#159447",
  },
  {
    id: "mock-servico-2",
    nome: "API de Pedidos",
    cor: "#2878B5",
  },
  {
    id: "mock-servico-3",
    nome: "API de Pagamentos",
    cor: "#D97732",
  },
  {
    id: "mock-servico-4",
    nome: "API de Relatórios",
    cor: "#8B5CF6",
  },
];

/**
 * Histórico fictício de consumo e emissões.
 *
 * Cada registro representa uma medição de um serviço em determinada data.
 * Os valores são exemplos para desenvolvimento e testes visuais.
 */
export const MOCK_HISTORICO: HistoricoComparacao[] = [
  // API de Usuários
  {
    servicoId: "mock-servico-1",
    data: "2026-11-01",
    energiaKwh: 2.4,
    co2eG: 180,
  },
  {
    servicoId: "mock-servico-1",
    data: "2026-11-02",
    energiaKwh: 2.6,
    co2eG: 195,
  },
  {
    servicoId: "mock-servico-1",
    data: "2026-11-03",
    energiaKwh: 2.3,
    co2eG: 172,
  },
  {
    servicoId: "mock-servico-1",
    data: "2026-11-04",
    energiaKwh: 2.8,
    co2eG: 210,
  },
  {
    servicoId: "mock-servico-1",
    data: "2026-11-05",
    energiaKwh: 2.5,
    co2eG: 188,
  },
  {
    servicoId: "mock-servico-1",
    data: "2026-11-06",
    energiaKwh: 2.7,
    co2eG: 203,
  },
  {
    servicoId: "mock-servico-1",
    data: "2026-11-07",
    energiaKwh: 2.4,
    co2eG: 180,
  },

  // API de Pedidos
  {
    servicoId: "mock-servico-2",
    data: "2026-11-01",
    energiaKwh: 3.5,
    co2eG: 263,
  },
  {
    servicoId: "mock-servico-2",
    data: "2026-11-02",
    energiaKwh: 3.8,
    co2eG: 285,
  },
  {
    servicoId: "mock-servico-2",
    data: "2026-11-03",
    energiaKwh: 3.6,
    co2eG: 270,
  },
  {
    servicoId: "mock-servico-2",
    data: "2026-11-04",
    energiaKwh: 4.1,
    co2eG: 308,
  },
  {
    servicoId: "mock-servico-2",
    data: "2026-11-05",
    energiaKwh: 3.9,
    co2eG: 293,
  },
  {
    servicoId: "mock-servico-2",
    data: "2026-11-06",
    energiaKwh: 3.7,
    co2eG: 278,
  },
  {
    servicoId: "mock-servico-2",
    data: "2026-11-07",
    energiaKwh: 3.4,
    co2eG: 255,
  },

  // API de Pagamentos
  {
    servicoId: "mock-servico-3",
    data: "2026-11-01",
    energiaKwh: 4.2,
    co2eG: 315,
  },
  {
    servicoId: "mock-servico-3",
    data: "2026-11-02",
    energiaKwh: 4.0,
    co2eG: 300,
  },
  {
    servicoId: "mock-servico-3",
    data: "2026-11-03",
    energiaKwh: 4.5,
    co2eG: 338,
  },
  {
    servicoId: "mock-servico-3",
    data: "2026-11-04",
    energiaKwh: 4.3,
    co2eG: 323,
  },
  {
    servicoId: "mock-servico-3",
    data: "2026-11-05",
    energiaKwh: 4.6,
    co2eG: 345,
  },
  {
    servicoId: "mock-servico-3",
    data: "2026-11-06",
    energiaKwh: 4.1,
    co2eG: 308,
  },
  {
    servicoId: "mock-servico-3",
    data: "2026-11-07",
    energiaKwh: 4.4,
    co2eG: 330,
  },

  // API de Relatórios
  {
    servicoId: "mock-servico-4",
    data: "2026-11-01",
    energiaKwh: 1.8,
    co2eG: 135,
  },
  {
    servicoId: "mock-servico-4",
    data: "2026-11-02",
    energiaKwh: 2.0,
    co2eG: 150,
  },
  {
    servicoId: "mock-servico-4",
    data: "2026-11-03",
    energiaKwh: 1.9,
    co2eG: 143,
  },
  {
    servicoId: "mock-servico-4",
    data: "2026-11-04",
    energiaKwh: 2.1,
    co2eG: 158,
  },
  {
    servicoId: "mock-servico-4",
    data: "2026-11-05",
    energiaKwh: 1.7,
    co2eG: 128,
  },
  {
    servicoId: "mock-servico-4",
    data: "2026-11-06",
    energiaKwh: 1.9,
    co2eG: 143,
  },
  {
    servicoId: "mock-servico-4",
    data: "2026-11-07",
    energiaKwh: 2.2,
    co2eG: 165,
  },
];
