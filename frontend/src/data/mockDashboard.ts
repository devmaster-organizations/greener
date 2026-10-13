/**
 * DADOS SIMULADOS DO DASHBOARD — GREENER
 *
 * ATENÇÃO: estes dados são utilizados apenas durante o desenvolvimento
 * do frontend.
 *
 * Na integração com o backend, substituir os dados simulados por dados
 * obtidos da API REST do GreenER, que consultará os registros persistidos
 * no PostgreSQL.
 *
 * A integração deverá ser feita por meio de uma camada de serviços
 * responsável pelas requisições HTTP, mantendo os componentes visuais
 * independentes da origem dos dados.
 *
 * Não utilizar estes valores como resultados reais de consumo de energia
 * ou emissões de CO₂e.
 */




export const indicadoresDashboard = [
  {
    id: 1,
    titulo: "Energia estimada",
    valor: "12,8 kWh",
    descricao: "Consumo acumulado no período",
  },
  {
    id: 2,
    titulo: "Emissões de CO₂e",
    valor: "1,09 kg",
    descricao: "Emissões estimadas de carbono",
  },
  {
    id: 3,
    titulo: "Serviços monitorados",
    valor: "8",
    descricao: "Serviços identificados",
  },
  {
    id: 4,
    titulo: "Serviços indisponíveis",
    valor: "1",
    descricao: "Serviços sem resposta",
  },
];


/**
 * Integração futura:
 * substituir este array pelos dados retornados pela API, agrupados por
 * serviço e período selecionado.
 *
 * O frontend espera:
 * - servico: nome do serviço;
 * - co2e: emissões estimadas em gramas de CO₂e.
 *
 * Manter esses nomes ou adaptar o mapeamento na camada de serviços,
 * sem alterar desnecessariamente o componente ImpactoPorServico.
 */

export const impactoPorServico = [
  { servico: "API", co2e: 18.4},
  { servico: "Frontend", co2e: 12.7},
  { servico: "Banco", co2e: 24.1},
  { servico: "Auth", co2e: 8.6},
  { servico: "Worker", co2e: 15.2},
];



/**
 * DADOS SIMULADOS — HISTÓRICO DE IMPACTO AMBIENTAL
 *
 * INTEGRAÇÃO COM O BACKEND:
 * Substituir estes dados pelos registros retornados pela API NestJS.
 *
 * Tabela sugerida: historico_coletas
 *
 * Campos sugeridos:
 * - id: identificador do registro;
 * - servico_id: referência ao serviço monitorado;
 * - data_coleta: data e hora da coleta;
 * - energia_kwh: energia estimada em kWh;
 * - co2e_g: emissões estimadas em gramas de CO₂e.
 *
 * Para este gráfico:
 * - agrupar os registros por dia ou período selecionado;
 * - somar co2e_g de todas as coletas do período;
 * - retornar data no formato de exibição do gráfico;
 * - retornar co2e como número, em gramas de CO₂e.
 *
 * A tabela e os nomes dos campos devem ser alinhados ao modelo
 * definitivo do banco PostgreSQL e aos endpoints da API.
 */
export const historicoImpacto = [
  { data: "06/10", co2e: 42.5 },
  { data: "07/10", co2e: 38.2 },
  { data: "08/10", co2e: 51.7 },
  { data: "09/10", co2e: 46.3 },
  { data: "10/10", co2e: 59.1 },
  { data: "11/10", co2e: 48.6 },
  { data: "12/10", co2e: 54.8 },
];



/**
 * DADOS SIMULADOS — COLETAS RECENTES
 *
 * INTEGRAÇÃO COM O BACKEND:
 * Substituir este array pelos registros retornados pela API NestJS.
 *
 * Tabela sugerida: historico_coletas
 *
 * Campos sugeridos:
 * - id: identificador da coleta;
 * - servico_id: referência ao serviço monitorado;
 * - data_coleta: data e hora da coleta;
 * - energia_kwh: energia estimada em kWh;
 * - co2e_g: emissões estimadas em gramas de CO₂e;
 * - status: resultado da coleta.
 *
 * A API deverá relacionar servico_id ao cadastro de serviços para
 * fornecer o nome do serviço exibido na tabela.
 * Os nomes definitivos devem ser alinhados ao modelo do backend.
 */
export const ultimasColetas = [
  {
    id: 1,
    servico: "API",
    dataHora: "13/10/2026 10:30",
    energiaKwh: 0.0842,
    co2e: 7.157,
    status: "Concluída",
  },
  {
    id: 2,
    servico: "Frontend",
    dataHora: "13/10/2026 10:25",
    energiaKwh: 0.0615,
    co2e: 5.228,
    status: "Concluída",
  },
  {
    id: 3,
    servico: "Banco de dados",
    dataHora: "13/10/2026 10:20",
    energiaKwh: 0.1028,
    co2e: 8.738,
    status: "Concluída",
  },
  {
    id: 4,
    servico: "Autenticação",
    dataHora: "13/10/2026 10:15",
    energiaKwh: 0,
    co2e: 0,
    status: "Indisponível",
  },
  {
    id: 5,
    servico: "Worker",
    dataHora: "13/10/2026 10:10",
    energiaKwh: 0.0731,
    co2e: 6.214,
    status: "Concluída",
  },
] satisfies {
  id: number;
  servico: string;
  dataHora: string;
  energiaKwh: number;
  co2e: number;
  status: "Concluída" | "Indisponível";
}[];



/**
 * DADOS SIMULADOS — SERVIÇOS MONITORADOS
 *
 * INTEGRAÇÃO COM O BACKEND:
 * Substituir estes dados pelos serviços retornados pela API NestJS.
 *
 * Tabela sugerida: servicos
 *
 * Campos sugeridos:
 * - id: identificador do serviço;
 * - nome: nome do serviço;
 * - status: situação atual do monitoramento;
 * - pais: país onde o serviço está localizado;
 * - regiao: região ou estado;
 * - cidade: cidade;
 * - energia_kwh: energia estimada no período;
 * - co2e_g: emissões estimadas em gramas de CO₂e.
 *
 * Os valores ambientais devem corresponder ao período consultado.
 * A API poderá obter energia e emissões do histórico de coletas,
 * relacionado ao serviço pelo seu identificador.
 *
 * Confirmar os nomes das tabelas, campos e endpoints com o responsável
 * pelo backend antes da integração definitiva.
 */
export const servicosMonitorados = [
  {
    id: 1,
    nome: "API",
    status: "Online",
    pais: "Brasil",
    regiao: "São Paulo",
    cidade: "São Paulo",
    energiaKwh: 2.84,
    co2e: 241.4,
  },
  {
    id: 2,
    nome: "Frontend",
    status: "Online",
    pais: "Brasil",
    regiao: "São Paulo",
    cidade: "São Paulo",
    energiaKwh: 1.92,
    co2e: 163.2,
  },
  {
    id: 3,
    nome: "Banco de dados",
    status: "Online",
    pais: "Brasil",
    regiao: "São Paulo",
    cidade: "São Paulo",
    energiaKwh: 4.16,
    co2e: 353.6,
  },
  {
    id: 4,
    nome: "Autenticação",
    status: "Indisponível",
    pais: "Brasil",
    regiao: "São Paulo",
    cidade: "São Paulo",
    energiaKwh: 0,
    co2e: 0,
  },
  {
    id: 5,
    nome: "Worker",
    status: "Online",
    pais: "Brasil",
    regiao: "São Paulo",
    cidade: "São Paulo",
    energiaKwh: 1.48,
    co2e: 125.8,
  },
] satisfies {
  id: number;
  nome: string;
  status: "Online" | "Indisponível";
  pais: string;
  regiao: string;
  cidade: string;
  energiaKwh: number;
  co2e: number;
}[];

