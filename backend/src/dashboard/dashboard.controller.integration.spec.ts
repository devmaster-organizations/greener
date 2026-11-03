import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DashboardModule } from './dashboard.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
      DashboardModule,
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return { moduleRef, app };
}

describe('DashboardController (integração)', () => {
  let moduleRef: Awaited<ReturnType<typeof criarModuloTeste>>['moduleRef'];
  let app: Awaited<ReturnType<typeof criarModuloTeste>>['app'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ moduleRef, app } = await criarModuloTeste());
    prisma = moduleRef.get(PrismaService);

    // Zera o banco de teste para que os agregados sejam determinísticos.
    await prisma.coleta.deleteMany();
    await prisma.servico.deleteMany();

    await prisma.servico.createMany({
      data: [
        {
          id: ID_SERVICO,
          nome: 'Billing API',
          regionCode: 'br-sudeste',
          metricsPath: '/metrics/billing-api',
          status: 'ATIVO',
        },
        {
          id: ID_SERVICO_B,
          nome: 'Checkout Worker',
          regionCode: 'us-east',
          metricsPath: '/metrics/checkout-worker',
          status: 'INDISPONIVEL',
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
      ],
    });
  }, 15_000);

  afterAll(async () => {
    try {
      await prisma.coleta.deleteMany();
      await prisma.servico.deleteMany();
    } finally {
      await app.close();
    }
  });

  it('GET /dashboard/indicadores retorna totais e contagens', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/dashboard/indicadores')
      .expect(200);

    expect(resposta.body).toEqual({
      energiaTotalKwh: 0.003,
      co2eTotalG: 0.255,
      coletasRegistradas: 2,
      servicosMonitorados: 2,
      servicosIndisponiveis: 1,
    });
  });

  it('GET /dashboard/historico agrupa o CO2e por dia', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/dashboard/historico')
      .expect(200);

    expect(resposta.body).toEqual([
      { dia: '2026-10-12', energiaKwh: 0.001, co2eG: 0.085 },
      { dia: '2026-10-13', energiaKwh: 0.002, co2eG: 0.17 },
    ]);
  });

  it('GET /dashboard/impacto-por-servico soma CO2e e energia por serviço', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/dashboard/impacto-por-servico')
      .expect(200);

    expect(resposta.body).toEqual([
      {
        servicoId: ID_SERVICO,
        servicoNome: 'Billing API',
        energiaKwh: 0.003,
        co2eG: 0.255,
      },
    ]);
  });

  it('os agregados do dashboard respeitam o período informado', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/dashboard/indicadores')
      .query({ de: DIA_2.toISOString() })
      .expect(200);

    expect(resposta.body).toMatchObject({
      energiaTotalKwh: 0.002,
      co2eTotalG: 0.17,
      coletasRegistradas: 1,
    });
  });
});
