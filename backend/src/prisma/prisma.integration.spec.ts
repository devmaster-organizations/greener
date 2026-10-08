import 'reflect-metadata';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service';

config({ path: '.env.test' });

describe('Integração Prisma com NestJS', () => {
  it('disponibiliza o PrismaService e consulta o PostgreSQL', async () => {
    const databaseUrl = process.env.DATABASE_URL_TEST;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL_TEST não foi definida');
    }

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({ DATABASE_URL: databaseUrl })],
        }),
        PrismaModule,
      ],
    }).compile();

    try {
      await moduleRef.init();

      const prisma = moduleRef.get(PrismaService);

      const resultado = await prisma.$queryRaw<
        Array<{ valor: number }>
      >`SELECT 1::integer AS valor`;

      expect(resultado).toEqual([{ valor: 1 }]);
    } finally {
      await moduleRef.close();
    }
  }, 15_000);
});