import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { lastValueFrom } from 'rxjs';

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
  async catHi() {
    this.client.send<string>('cat.hi', {}).subscribe((pubAck) => {
      console.log(pubAck);
    });
    //{ stream: 'catstream', seq: 1, duplicate: false }
    return 'Cat hi.';
  }

  @Get('cat-get')
  async catGet() {
    try {
      const data = await lastValueFrom(this.client.emit('get-all-cat', {}));
      console.log(data);
      //{
      //   response: [ { id: 1, name: 'TOM' } ],
      //   isDisposed: true,
      //   duplicate: false
      //}
      return data?.response;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('replace-emoji')
  async replaceEmoji() {
    // Send return data
    // Emit return
    //     {
    //   "response": "Data",
    //   "isDisposed": true,
    //   "duplicate": false
    // }
    const result = await lastValueFrom(this.client.emit('replace-emoji', {}));
    return result;
  }
}
