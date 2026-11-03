import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

const SENHA = 'greener123';
const USUARIO = {
  id: '00000000-0000-4000-8000-000000000001',
  nome: 'Administrador GreenER',
  email: 'admin@greener.com',
  senhaHash: hashSync(SENHA, 4),
  createdAt: new Date('2026-11-01T00:00:00Z'),
  updatedAt: new Date('2026-11-01T00:00:00Z'),
};

function criarService(usuario: typeof USUARIO | null = USUARIO) {
  const prisma = {
    usuario: {
      findUnique: vi.fn().mockResolvedValue(usuario),
    },
  };

  const jwt = {
    signAsync: vi.fn().mockResolvedValue('token-jwt'),
  };

  return {
    service: new AuthService(
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
    ),
    prisma,
    jwt,
  };
}

describe('AuthService', () => {
  it('autentica com e-mail e senha válidos e devolve o token', async () => {
    const { service, prisma, jwt } = criarService();

    const resposta = await service.autenticar('admin@greener.com', SENHA);

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@greener.com' },
    });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: USUARIO.id,
      email: USUARIO.email,
      nome: USUARIO.nome,
    });
    expect(resposta).toEqual({
      access_token: 'token-jwt',
      usuario: {
        id: USUARIO.id,
        nome: USUARIO.nome,
        email: USUARIO.email,
      },
    });
  });

  it('normaliza o e-mail antes de consultar o usuário', async () => {
    const { service, prisma } = criarService();

    await service.autenticar('  Admin@Greener.com  ', SENHA);

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@greener.com' },
    });
  });

  it('rejeita e-mail inexistente', async () => {
    const { service } = criarService(null);

    await expect(
      service.autenticar('ninguem@greener.com', SENHA),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      service.autenticar('ninguem@greener.com', SENHA),
    ).rejects.toThrow('E-mail ou senha inválidos');
  });

  it('rejeita senha incorreta', async () => {
    const { service, jwt } = criarService();

    await expect(
      service.autenticar('admin@greener.com', 'senha-errada'),
    ).rejects.toThrow(UnauthorizedException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
