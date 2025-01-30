import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { LanguageEnum } from '../types';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import {
  getFreshArticle,
  getCategories,
  getArticlesByCategory,
} from './services';
import { FAILED_TO_RETRIEVE_ARTICLES } from '../consts';
@Injectable()
export class LanguageService {
  constructor(private readonly dataBase: DatabaseService) {}
  async getArticleToLanguage(language: LanguageEnum) {
    try {
      const freshArticle = await getFreshArticle(language, this.dataBase);
      const categories = await getCategories(language, this.dataBase);
      const categoryArticles = await getArticlesByCategory(
        categories,
        language,
        this.dataBase,
      );
      return {
        statusCode: HttpStatus.OK,
        language,
        freshArticle,
        categories: categoryArticles,
      };
    } catch (error) {
      this.handleError(error);
    }
  }
  private handleError(error: string | HttpException) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLES, error);
  }
}
