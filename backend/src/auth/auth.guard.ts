import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publico = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (publico) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const [tipo, token] = (request.headers.authorization ?? '').split(' ');

    if (tipo?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Token de acesso não informado');
    }

    try {
      await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token de acesso inválido ou expirado');
    }

    return true;
  }
}
