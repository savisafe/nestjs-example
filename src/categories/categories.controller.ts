import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async get_categories(@Res({ passthrough: true }) response, @Req() request) {
    return this.categoriesService.getCategories(response, request);
  }
}
