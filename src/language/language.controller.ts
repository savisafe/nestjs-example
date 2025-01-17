import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get(':language')
  @HttpCode(HttpStatus.OK)
  async get_articles_to_language(@Param('language') language) {
    return this.languageService.getArticleToLanguage(language);
  }
}
