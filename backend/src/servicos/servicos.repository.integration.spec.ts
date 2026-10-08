import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ServicosRepository } from './servicos.repository.js';

config({ path: '.env.test' });

describe('Persistência de serviços', () => {
  it('salva um serviço novo no PostgreSQL', async () => {
    const databaseUrl = process.env.DATABASE_URL_TEST;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL_TEST não foi definida');
    }

    if (new URL(databaseUrl).pathname !== '/greener_test') {
      throw new Error('O teste deve usar o banco greener_test');
    }

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ DATABASE_URL: databaseUrl })],
        }),
        PrismaModule,
      ],
      providers: [ServicosRepository],
    }).compile();

    const id = `teste-${randomUUID()}`;
    const prisma = moduleRef.get(PrismaService);

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
        await prisma.servico.deleteMany({
          where: { id },
        });
      } finally {
        await moduleRef.close();
      }
    }
  }, 15_000);
});