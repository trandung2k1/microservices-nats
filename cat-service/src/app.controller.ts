import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('get-all-cat')
  getAllCat(@Ctx() @Ctx() context: NatsJetStreamContext) {
    console.log('Received: ' + context.message.subject);
    const cats = [
      {
        id: 1,
        name: 'TOM',
      },
    ];
    return cats;
  }

  @EventPattern('cat.hello')
  public async catHello(@Ctx() context: NatsJetStreamContext) {
    context.message.ack();
    console.log('Received: ' + context.message.subject);
  }

  @EventPattern('cat.msg')
  public async catMsg(@Ctx() context: NatsJetStreamContext) {
    context.message.ack();
    console.log('Received: ' + context.message.subject);
  }

  @MessagePattern('cat.get')
  async catGet(@Payload() data: any, @Ctx() context: NatsJetStreamContext) {
    console.log('Received: ' + context.message.subject);
    console.log(data);
    // context.message.ack();
    return {
      id: 1,
      name: 'TOM',
    };
  }
}
