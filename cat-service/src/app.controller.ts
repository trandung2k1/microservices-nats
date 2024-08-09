import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, NatsContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('get-all-cat')
  getAllCat(@Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`);
    const cats = [
      {
        id: 1,
        name: 'TOM',
      },
    ];
    return cats;
  }
}
