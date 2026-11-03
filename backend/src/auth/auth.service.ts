import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: UsuarioAutenticado;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(JwtService)
    private readonly jwt: JwtService,
  ) {}

  async autenticar(email: string, senha: string): Promise<LoginResponse> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    const senhaValida = usuario
      ? await compare(senha, usuario.senhaHash)
      : false;

    if (!usuario || !senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const accessToken = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
    });

    return {
      access_token: accessToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }
}
