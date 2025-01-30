import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Article } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get(':language')
  @HttpCode(HttpStatus.OK)
  async get_categories(
    @Param('language') language: Extract<Article, 'language'>,
  ) {
    return this.categoriesService.getCategories(language);
  }
}
