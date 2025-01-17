import { ExampleService } from './example.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { CorsInterceptor } from '../cors.interceptor';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}
  @Get(':language')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CorsInterceptor)
  async getExample(@Param('language') language) {
    return this.exampleService.getExample(language);
  }
}
