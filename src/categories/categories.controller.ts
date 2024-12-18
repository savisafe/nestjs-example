import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get(':language')
  @HttpCode(HttpStatus.OK)
  async get_categories(
    @Param('language') language,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    return this.categoriesService.getCategories(language, response);
  }
}
