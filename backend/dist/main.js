import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });
    app.enableShutdownHooks();
    console.log(process.env.PORT);
    await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
//# sourceMappingURL=main.js.map