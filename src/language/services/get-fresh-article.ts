import { Prisma } from '@prisma/client';
import { LanguageEnum } from '../../types';
import { DatabaseService } from '../../database';
export async function getFreshArticle(
  language: LanguageEnum,
  dataBase: DatabaseService,
) {
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
  return dataBase.article.findFirst(freshArticleArgs);
}
