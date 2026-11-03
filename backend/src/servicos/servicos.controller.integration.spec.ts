import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';
import { ServicosModule } from './servicos.module.js';

config({ path: '.env.test' });

const ID_SERVICO = `teste-${randomUUID()}`;

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
      ServicosModule,
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return { moduleRef, app };
}

describe('ServicosController (integração)', () => {
  let moduleRef: Awaited<ReturnType<typeof criarModuloTeste>>['moduleRef'];
  let app: Awaited<ReturnType<typeof criarModuloTeste>>['app'];
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ moduleRef, app } = await criarModuloTeste());
    prisma = moduleRef.get(PrismaService);

    await prisma.servico.create({
      data: {
        id: ID_SERVICO,
        nome: 'Billing API',
        regionCode: 'br-sudeste',
        pais: 'Brazil',
        regiao: 'Sudeste',
        cidade: 'Sao Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        metricsPath: '/metrics/billing-api',
        status: 'ATIVO',
      },
    });
  }, 15_000);

  afterAll(async () => {
    try {
      await prisma.servico.deleteMany({ where: { id: ID_SERVICO } });
    } finally {
      await app.close();
    }
  });

  it('GET /servicos retorna a lista com status e localização', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/servicos')
      .expect(200);

    const servico = resposta.body.find(
      (item: { id: string }) => item.id === ID_SERVICO,
    );

    expect(servico).toMatchObject({
      id: ID_SERVICO,
      nome: 'Billing API',
      status: 'ATIVO',
      regionCode: 'br-sudeste',
      pais: 'Brazil',
      regiao: 'Sudeste',
      cidade: 'Sao Paulo',
      latitude: -23.5505,
      longitude: -46.6333,
      metricsPath: '/metrics/billing-api',
    });
    expect(typeof servico.latitude).toBe('number');
    expect(typeof servico.longitude).toBe('number');
  });

  it('GET /servicos/:id retorna o detalhe do serviço', async () => {
    const resposta = await request(app.getHttpServer())
      .get(`/servicos/${ID_SERVICO}`)
      .expect(200);

    expect(resposta.body).toMatchObject({
      id: ID_SERVICO,
      nome: 'Billing API',
      status: 'ATIVO',
    });
  });

  it('GET /servicos/:id devolve 404 para serviço inexistente', async () => {
    const resposta = await request(app.getHttpServer())
      .get('/servicos/nao-existe')
      .expect(404);

    expect(resposta.body.message).toBe('Serviço "nao-existe" não encontrado');
  });
});
