import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard.js';

function criarContexto(headers: Record<string, string> = {}): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

function criarGuard(publico = false, tokenValido = true) {
  const jwt = {
    verifyAsync: tokenValido
      ? vi.fn().mockResolvedValue({ sub: 'usuario-1' })
      : vi.fn().mockRejectedValue(new Error('token inválido')),
  };

  const reflector = {
    getAllAndOverride: vi.fn().mockReturnValue(publico),
  };

  return {
    guard: new AuthGuard(
      jwt as unknown as JwtService,
      reflector as unknown as Reflector,
    ),
    jwt,
  };
}

describe('AuthGuard', () => {
  it('libera rotas marcadas como públicas sem exigir token', async () => {
    const { guard, jwt } = criarGuard(true);

    await expect(guard.canActivate(criarContexto())).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejeita requisição sem cabeçalho Authorization', async () => {
    const { guard } = criarGuard();

    await expect(guard.canActivate(criarContexto())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejeita esquema de autenticação diferente de Bearer', async () => {
    const { guard } = criarGuard();

    await expect(
      guard.canActivate(criarContexto({ authorization: 'Basic abc' })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejeita token inválido ou expirado', async () => {
    const { guard } = criarGuard(false, false);

    await expect(
      guard.canActivate(criarContexto({ authorization: 'Bearer expirado' })),
    ).rejects.toThrow('Token de acesso inválido ou expirado');
  });

  it('libera a requisição com um token válido', async () => {
    const { guard, jwt } = criarGuard();

    await expect(
      guard.canActivate(criarContexto({ authorization: 'Bearer token-jwt' })),
    ).resolves.toBe(true);
    expect(jwt.verifyAsync).toHaveBeenCalledWith('token-jwt');
  });
});
