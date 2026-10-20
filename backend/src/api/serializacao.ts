/**
 * Converte valores decimais do Prisma para número de JS, preservando null.
 * Evita que Decimal vire string/objeto na resposta JSON.
 */
export function paraNumero(valor: unknown): number | null {
  if (valor === null || valor === undefined) {
    return null;
  }

  return Number(valor);
}

export function paraNumeroOuZero(valor: unknown): number {
  return paraNumero(valor) ?? 0;
}
