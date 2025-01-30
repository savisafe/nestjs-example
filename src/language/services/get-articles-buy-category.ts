import { LanguageEnum } from '../../types';
import { DatabaseService } from '../../database';
import { Category, Prisma } from '@prisma/client';

export async function getArticlesByCategory(
  categories,
  language: LanguageEnum,
  dataBase: DatabaseService,
) {
  return Promise.all(
    categories.map(async (category: Category) => {
      const freshArticleArgs: Prisma.ArticleFindFirstArgs = {
        where: {
          language,
          category,
        },
        take: 3,
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
      const articles = await dataBase.article.findMany(freshArticleArgs);
      return { category, articles };
    }),
  );
}
