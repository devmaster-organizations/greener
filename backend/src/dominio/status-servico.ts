/**
 * Estados possíveis de um serviço monitorado.
 */
export const StatusServico = {
  Ativo: 'ATIVO',
  Indisponivel: 'INDISPONIVEL',
  SemMetricas: 'SEM_METRICAS',
  Removido: 'REMOVIDO',
} as const;

export type StatusServico = (typeof StatusServico)[keyof typeof StatusServico];

/**
 * Estados possíveis de uma coleta registrada.
 */
export const StatusColeta = {
  Ativo: 'ATIVO',
  Indisponivel: 'INDISPONIVEL',
  SemMetricas: 'SEM_METRICAS',
} as const;

export type StatusColeta = (typeof StatusColeta)[keyof typeof StatusColeta];
