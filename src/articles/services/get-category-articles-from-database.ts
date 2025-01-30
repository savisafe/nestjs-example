import { DatabaseService } from '../../database';
import { IArticle } from '../../types';

export async function getCategoryArticlesFromDatabase(
  category: Extract<IArticle, 'category'>,
  language: Extract<IArticle, 'language'>,
  page: number,
  pageSize: number,
  dataBase: DatabaseService,
) {
  const take = Number(pageSize);
  const skip = (page - 1) * take;
  const articles = await dataBase.article.findMany({
    where: {
      category,
      language,
      draft: false,
    },
    skip,
    take,
  });
  const totalArticles = await dataBase.article.count({
    where: { category, language, draft: false },
  });
  return { articles, totalArticles };
}
