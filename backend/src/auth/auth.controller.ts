import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AuthService, type LoginResponse } from './auth.service.js';

export interface LoginRequest {
  email?: string;
  password?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const email = body?.email?.trim();
    const senha = body?.password;

    if (!email || !senha) {
      throw new BadRequestException('Informe e-mail e senha');
    }

    return this.auth.autenticar(email, senha);
  }
}
