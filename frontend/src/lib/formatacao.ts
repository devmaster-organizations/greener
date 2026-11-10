export const ROTULO_STATUS_SERVICO: Record<string, string> = {
  ATIVO: "Online",
  INDISPONIVEL: "Indisponível",
  SEM_METRICAS: "Sem métricas",
  REMOVIDO: "Removido",
};

export const ROTULO_STATUS_COLETA: Record<string, string> = {
  ATIVO: "Concluída",
  INDISPONIVEL: "Indisponível",
  SEM_METRICAS: "Sem métricas",
};

export const CLASSE_STATUS: Record<string, string> = {
  ATIVO: "bg-[#E5F5E9] text-[#087443]",
  INDISPONIVEL: "bg-[#FFF0E5] text-[#A64B12]",
  SEM_METRICAS: "bg-[#FFF8E1] text-[#8A6D1F]",
};

export const CLASSE_STATUS_DESCONHECIDO =
  "bg-[#EEF2F0] text-[#52666A]";

export function formatarNumero(
  valor: number | null | undefined,
  casas: number,
): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return "—";
  }

  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export function formatarComUnidade(
  valor: number | null | undefined,
  casas: number,
  unidade: string,
  espaco = " ",
): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return "—";
  }

  return `${formatarNumero(valor, casas)}${espaco}${unidade}`;
}

export function formatarDataHora(valor: string | null | undefined): string {
  if (!valor) {
    return "—";
  }

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

export function formatarDataHoraCurta(
  valor: string | null | undefined,
): string {
  if (!valor) {
    return "—";
  }

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return data
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}

export function formatarLocalizacao(servico: {
  cidade?: string | null;
  regiao?: string | null;
  pais?: string | null;
}): string {
  const partes = [servico.cidade, servico.regiao, servico.pais].filter(
    (parte): parte is string => Boolean(parte),
  );

  return partes.length > 0 ? partes.join(", ") : "Localização não informada";
}
