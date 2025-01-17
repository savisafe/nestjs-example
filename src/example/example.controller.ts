import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CorsInterceptor } from '../cors.interceptor';

@Controller('example')
export class ExampleController {
  @Get()
  @UseInterceptors(CorsInterceptor)
  getExample() {
    return 'cors example';
  }
}
