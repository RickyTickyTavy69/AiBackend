import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './auth/public-strategy';

@Controller("test")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get("getHello")
  getHello(): string {
    return this.appService.getHello();
  }
}
