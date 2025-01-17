import { ExampleService } from './example.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CorsInterceptor } from '../cors.interceptor';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}
  @Get(':language')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CorsInterceptor)
  async getExample(
    @Param('language') language,
    @Res({ passthrough: true }) response,
  ) {
    return this.exampleService.getExample(language, response);
  }
}
