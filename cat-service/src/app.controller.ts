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
  getAllCat(@Payload() data: string, @Ctx() context: NatsJetStreamContext) {
    console.log('Received: ' + context.message.subject);
    const cats = [
      {
        id: 1,
        name: 'TOM',
      },
    ];
    return cats;
  }

  // Background
  @EventPattern('cat.hello')
  public async catHello(@Ctx() context: NatsJetStreamContext) {
    context.message.ack();
    console.log('Received: ' + context.message.subject);
  }

  @EventPattern('cat.hi')
  public async catHi(@Ctx() context: NatsJetStreamContext) {
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
    return {
      id: 1,
      name: 'TOM',
    };
  }

  @MessagePattern('replace-emoji')
  replaceEmoji(
    @Payload() data: string,
    @Ctx() context: NatsJetStreamContext,
  ): string {
    console.log('Received: ' + context.message.subject);
    console.log('Consummer');
    return 'Data';
  }

  // Not working Nats JetStream
  // @EventPattern('replace-emoji')
  // replaceEmoji(@Payload() data: string, @Ctx() context: NatsContext): string {
  //   console.log('Consummer');
  //   return 'Data';
  // }
}
