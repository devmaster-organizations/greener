import { describe, expect, it, vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

const RESPOSTA = {
  access_token: 'token-jwt',
  usuario: {
    id: '00000000-0000-4000-8000-000000000001',
    nome: 'Administrador GreenER',
    email: 'admin@greener.com',
  },
};

function criarController() {
  const auth = {
    autenticar: vi.fn().mockResolvedValue(RESPOSTA),
  };

  return {
    controller: new AuthController(auth as unknown as AuthService),
    auth,
  };
}

describe('AuthController', () => {
  it('delega o login ao serviço de autenticação', async () => {
    const { controller, auth } = criarController();

    const resposta = await controller.login({
      email: ' admin@greener.com ',
      password: 'greener123',
    });

    expect(auth.autenticar).toHaveBeenCalledWith(
      'admin@greener.com',
      'greener123',
    );
    expect(resposta).toEqual(RESPOSTA);
  });

  it('exige e-mail e senha', async () => {
    const { controller, auth } = criarController();

    await expect(
      controller.login({ email: '', password: 'greener123' }),
    ).rejects.toThrow(BadRequestException);
    await expect(
      controller.login({ email: 'admin@greener.com' }),
    ).rejects.toThrow(BadRequestException);
    expect(auth.autenticar).not.toHaveBeenCalled();
  });
});
