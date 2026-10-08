import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { ServicosModule } from './servicos.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ServicosRepository } from './servicos.repository.js';

config({ path: '.env.test' });

async function criarModuloTeste() {
  const databaseUrl = process.env.DATABASE_URL_TEST;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL_TEST não foi definida');
  }

  if (new URL(databaseUrl).pathname !== '/greener_test') {
    throw new Error('O teste deve usar o banco greener_test');
  }

  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        ignoreEnvFile: true,
        load: [() => ({ DATABASE_URL: databaseUrl })],
      }),
      ServicosModule,
    ],
  }).compile();
}

describe('Persistência de serviços', () => {
  it('salva um serviço novo no PostgreSQL', async () => {
    const moduleRef = await criarModuloTeste();
    const prisma = moduleRef.get(PrismaService);
    const id = `teste-${randomUUID()}`;

    try {
      await moduleRef.init();

      const repository = moduleRef.get(ServicosRepository);

      const servico = {
        id,
        nome: 'Billing API',
        regionCode: 'br-sudeste',
        pais: 'Brasil',
        regiao: 'Sudeste',
        cidade: 'São José dos Campos',
        metricsPath: '/metrics/billing',
      };

      await repository.salvar(servico);

      const persistido = await prisma.servico.findUnique({
        where: { id },
      });

      expect(persistido).not.toBeNull();
      expect(persistido).toMatchObject(servico);
      expect(persistido?.createdAt).toBeInstanceOf(Date);
      expect(persistido?.updatedAt).toBeInstanceOf(Date);
    } finally {
      try {
        await prisma.servico.deleteMany({ where: { id } });
      } finally {
        await moduleRef.close();
      }
    }
  }, 15_000);

  it('atualiza o mesmo ID sem duplicar o serviço', async () => {
    const moduleRef = await criarModuloTeste();
    const prisma = moduleRef.get(PrismaService);
    const id = `teste-${randomUUID()}`;

    try {
      await moduleRef.init();

      const repository = moduleRef.get(ServicosRepository);

      // Primeira gravação: cadastra o serviço.
      const servico = {
        id,
        nome: 'Billing API',
        regionCode: 'br-sudeste',
        metricsPath: '/metrics/billing',
      };

      await repository.salvar(servico);

      const original = await prisma.servico.findUniqueOrThrow({
        where: { id },
      });

      // Segunda gravação: mesmo ID, com dados diferentes.
      const atualizado = {
        ...servico,
        nome: 'Billing API atualizada',
        regionCode: 'br-sul',
        metricsPath: '/metrics/billing-v2',
      };

      await repository.salvar(atualizado);

      // Verifica os dados atualizados e a ausência de duplicação.
      const persistido = await prisma.servico.findUniqueOrThrow({
        where: { id },
      });

      const quantidade = await prisma.servico.count({
        where: { id },
      });

      expect(persistido).toMatchObject(atualizado);
      expect(persistido.createdAt).toEqual(original.createdAt);
      expect(quantidade).toBe(1);
    } finally {
      try {
        await prisma.servico.deleteMany({ where: { id } });
      } finally {
        await moduleRef.close();
      }
    }
  }, 15_000);
});