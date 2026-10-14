import 'reflect-metadata';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { AgregadorClient } from './agregador.client.js';
import { AgregadorModule } from './agregador.module.js';

describe('AgregadorModule', () => {
  it('disponibiliza o AgregadorClient por injeção de dependência', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [() => ({
            AGREGADOR_BASE_URL: 'https://metrics.unilaunch.org',
            AGREGADOR_TIMEOUT_MS: '5000',
          })],
        }),
        AgregadorModule,
      ],
    }).compile();

    try {
      const client = moduleRef.get(AgregadorClient);

      expect(client).toBeInstanceOf(AgregadorClient);
    } finally {
      await moduleRef.close();
    }
  });
});