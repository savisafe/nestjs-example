import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import { setHead } from '../functions';
import { LanguageEnum } from '../types';
import { Response } from 'express';
import { FAILED_TO_RETRIEVE_ARTICLES } from '../consts';
import { Prisma } from '@prisma/client';

@Injectable()
export class LanguageService {
  constructor(private readonly dataBase: DatabaseService) {}

  async getArticleToLanguage(language: LanguageEnum, response: Response) {
    setHead(response);

    try {
      const freshArticleArgs: Prisma.ArticleFindFirstArgs = {
        where: {
          language,
          draft: false,
        },
        orderBy: { date: 'desc' },
        select: {
          title: true,
          slug: true,
          description: true,
          date: true,
          author: true,
          category: true,
          language: true,
          preview_image: true,
        },
      };
      const freshArticle =
        await this.dataBase.article.findFirst(freshArticleArgs);
      const categories = await this.getCategories(language);
      const categoryArticles = await this.getArticlesByCategory(
        categories,
        language,
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

  private async getCategories(language: LanguageEnum): Promise<string[]> {
    const articles = await this.dataBase.article.findMany({
      where: { draft: false, language },
      select: { category: true },
    });
    return [...new Set(articles.map((item) => item.category))];
  }

  private async getArticlesByCategory(categories, language: LanguageEnum) {
    return Promise.all(
      categories.map(async (category) => {
        const freshArticleArgs: Prisma.ArticleFindFirstArgs = {
          where: {
            language,
            category,
          },
          orderBy: { date: 'desc' },
          select: {
            title: true,
            slug: true,
            description: true,
            date: true,
            author: true,
            category: true,
            language: true,
            preview_image: true,
          },
        };
        const articles = await this.dataBase.article.findMany(freshArticleArgs);
        return { category, articles };
      }),
    );
  }

  private handleError(error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLES, error);
  }
}
