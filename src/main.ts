import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
    bodyParser: true,
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
      user: 'nats',
      pass: '123456789',
      // queue: 'cats_queue',
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
