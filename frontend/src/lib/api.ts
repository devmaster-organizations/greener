import { TOKEN_KEY } from './auth-constants';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function extrairMensagem(data: unknown, status: number): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (typeof message === 'string' && message) {
      return message;
    }
  }

  return `Erro ao conectar ao servidor (HTTP ${status}).`;
}

function tokenArmazenado(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  const corpoNaoFormData =
    typeof FormData === 'undefined' || !(init?.body instanceof FormData);

  if (init?.body !== undefined && corpoNaoFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = tokenArmazenado();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const usarTimeout = init?.signal === undefined;
  const controller = new AbortController();
  const timeout = usarTimeout
    ? setTimeout(() => controller.abort(), TIMEOUT_MS)
    : undefined;

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      signal: init?.signal ?? controller.signal,
    });
  } catch (error) {
    if (usarTimeout && controller.signal.aborted) {
      throw new ApiError('Tempo de resposta do servidor excedido.', 408);
    }

    throw error;
  } finally {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(extrairMensagem(data, response.status), response.status);
  }

  return data as T;
}
