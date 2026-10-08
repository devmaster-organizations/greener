import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Mantenha aqui a interface SalvarServicoInput existente.

@Injectable()
export class ServicosRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async salvar(servico: SalvarServicoInput): Promise<void> {
    await this.prisma.servico.create({
      data: servico,
    });
  }
}