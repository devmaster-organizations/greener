import { apiFetch } from './api';
import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE } from './auth-constants';

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: UsuarioAutenticado;
}

const TOKEN_KEY = 'greener_token';
const USUARIO_KEY = 'greener_usuario';

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const resposta = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem(TOKEN_KEY, resposta.access_token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(resposta.usuario));
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(resposta.access_token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax`;

  return resposta;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario(): UsuarioAutenticado | null {
  const usuario = localStorage.getItem(USUARIO_KEY);

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario) as UsuarioAutenticado;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
