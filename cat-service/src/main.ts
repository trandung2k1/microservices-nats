import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomStrategy } from '@nestjs/microservices';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

async function bootstrap() {
  const options: CustomStrategy = {
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: 'localhost:4222',
        name: 'cat-listener',
      },
      consumerOptions: {
        deliverGroup: 'cat-group',
        durable: 'cat-durable',
        deliverTo: 'cat-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'catstream',
        subjects: ['cat.*'],
      },
      //   streamConfig: [{
      //     name: 'mystream',
      //     subjects: ['order.*'],
      //   },{
      //     name: 'myOtherStream',
      //     subjects: ['other.*'],
      //   }],
    }),
  };
  // hybrid microservice and web application
  const app = await NestFactory.create(AppModule);
  const microService = app.connectMicroservice(options);
  microService.listen();
  app.listen(3000);
}
bootstrap();
