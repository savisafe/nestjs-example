import { Article } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../../database';

export async function getCategoriesFromDatabase(
  language: Extract<Article, 'language'>,
  dataBase: DatabaseService,
) {
  try {
    const categories = await dataBase.article.findMany({
      where: { draft: false, language },
      select: { category: true },
    });
    return [...new Set(categories.map(({ category }) => category))];
  } catch (error) {
    throw new HttpException(
      'Failed to fetch categories',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
