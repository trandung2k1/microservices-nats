import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // @Inject('CAT_SERVICE') private client: ClientProxy,
    private client: NatsJetStreamClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cat-hello')
  catHello(): string {
    this.client.emit<string>('cat.hello', {}).subscribe((pubAck) => {
      console.log(pubAck);
    });
    return 'Cat hello.';
  }

  @Get('cat-hi')
  catHi(): string {
    this.client.emit<string>('cat.hi', {}).subscribe((pubAck) => {
      console.log(pubAck);
    });
    return 'Cat hi.';
  }

  @Get('cat-get')
  async catGet() {
    try {
      const data = await this.client.emit('get-all-cat', {}).toPromise();
      return data?.response;
    } catch (error) {
      console.log(error);
    }
  }
}
