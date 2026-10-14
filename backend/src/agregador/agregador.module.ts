import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AgregadorClient } from './agregador.client.js';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: AgregadorClient,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const baseUrl = config.getOrThrow<string>('AGREGADOR_BASE_URL');

        const timeoutMs = Number(
          config.get<string>('AGREGADOR_TIMEOUT_MS') ?? '5000',
        );

        if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
          throw new Error(
            'AGREGADOR_TIMEOUT_MS deve ser um inteiro positivo',
          );
        }

        return new AgregadorClient(baseUrl, fetch, timeoutMs);
      },
    },
  ],
  exports: [AgregadorClient],
})
export class AgregadorModule {}