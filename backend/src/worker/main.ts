import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module.js';

/**
 * Entrypoint do Worker do GreenER.
 *
 * Diferente do backend, o Worker não expõe HTTP: cria apenas o contexto da
 * aplicação, onde o `MonitoramentoService` registra o intervalo de coleta.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();

  new Logger('Worker').log('GreenER Worker em execução.');
}

await bootstrap();
