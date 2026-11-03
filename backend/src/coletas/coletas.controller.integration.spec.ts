import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { ColetasModule } from './coletas.module.js';

config({ path: '.env.test' });

const PREFIXO = `teste-${randomUUID()}`;
const ID_SERVICO = `${PREFIXO}-api`;
const ID_SERVICO_B = `${PREFIXO}-worker`;

const DIA_1 = new Date('2026-10-12T12:00:00Z');
const DIA_2 = new Date('2026-10-13T12:00:00Z');

async function criarModuloTeste() {
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
      ColetasModule,
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return { moduleRef, app };
}

describe('ColetasController (integração)', () => {
  let moduleRef: Awaited<ReturnType<typeof criarModuloTeste>>['moduleRef'];
  let app: Awaited<ReturnType<typeof criarModuloTeste>>['app'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ moduleRef, app } = await criarModuloTeste());
    prisma = moduleRef.get(PrismaService);

    await prisma.servico.createMany({
      data: [
        {
          id: ID_SERVICO,
          nome: 'Billing API',
          regionCode: 'br-sudeste',
          metricsPath: '/metrics/billing-api',
        },
        {
          id: ID_SERVICO_B,
          nome: 'Checkout Worker',
          regionCode: 'us-east',
          metricsPath: '/metrics/checkout-worker',
        },
      ],
    });

    await prisma.coleta.createMany({
      data: [
        {
          servicoId: ID_SERVICO,
          coletadaAt: DIA_1,
          status: 'ATIVO',
          energiaKwh: 0.001,
          co2eG: 0.085,
        },
        {
          servicoId: ID_SERVICO,
          coletadaAt: DIA_2,
          status: 'ATIVO',
          energiaKwh: 0.002,
          co2eG: 0.17,
        },
        {
          servicoId: ID_SERVICO_B,
          coletadaAt: DIA_2,
          status: 'INDISPONIVEL',
          erro: 'HTTP 500 — serviço indisponível',
        },
      ],
    });
  }, 15_000);

  afterAll(async () => {
    try {
      await prisma.coleta.deleteMany({
        where: { servicoId: { startsWith: PREFIXO } },
      });
      await prisma.servico.deleteMany({
        where: { id: { startsWith: PREFIXO } },
      });
    } finally {
      await app.close();
    }
  });

  it('GET /coletas retorna as coletas com o nome do serviço', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/coletas')
      .query({ servicoId: ID_SERVICO })
      .expect(200);

    expect(resposta.body).toHaveLength(2);
    // Mais recente primeiro.
    expect(resposta.body[0]).toMatchObject({
      servicoId: ID_SERVICO,
      servicoNome: 'Billing API',
      status: 'ATIVO',
      energiaKwh: 0.002,
      co2eG: 0.17,
    });
    expect(resposta.body[1]).toMatchObject({
      servicoId: ID_SERVICO,
      servicoNome: 'Billing API',
      energiaKwh: 0.001,
      co2eG: 0.085,
    });
  });

  it('GET /coletas filtra por período (de/ate)', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/coletas')
      .query({ servicoId: ID_SERVICO, de: DIA_2.toISOString() })
      .expect(200);

    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].coletadaAt).toBe(DIA_2.toISOString());
  });

  it('GET /coletas respeita o limit e retorna erro na coleta indisponível', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/coletas')
      .query({ limit: 1 })
      .expect(200);

    expect(resposta.body).toHaveLength(1);

    const indisponivel = await request(app.getHttpServer())
      .get('/coletas')
      .query({ servicoId: ID_SERVICO_B })
      .expect(200);

    expect(indisponivel.body[0]).toMatchObject({
      status: 'INDISPONIVEL',
      erro: 'HTTP 500 — serviço indisponível',
      energiaKwh: null,
      co2eG: null,
    });
  });

  it('GET /coletas devolve 400 para parâmetros inválidos', async () => {
    await request(app.getHttpServer())
      .get('/coletas')
      .query({ limit: 'abc' })
      .expect(400);

    await request(app.getHttpServer())
      .get('/coletas')
      .query({ de: 'nao-e-data' })
      .expect(400);
  });
});
