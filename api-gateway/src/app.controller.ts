import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('CAT_SERVICE') private client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cats')
  async getAllCat() {
    // this.client.emit('get-all-cat', {});
    try {
      // const data = await lastValueFrom(this.client.send('get-all-cat', {}));
      const data = await this.client.send('get-all-cat', {}).toPromise();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
