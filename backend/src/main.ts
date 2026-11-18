import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // O frontend (Next.js) roda em outra origem (http://localhost:3002).
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3002',
  });

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
