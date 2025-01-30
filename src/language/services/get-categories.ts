import { LanguageEnum } from '../../types';
import { DatabaseService } from '../../database';

export async function getCategories(
  language: LanguageEnum,
  dataBase: DatabaseService,
): Promise<string[]> {
  const articles: { category: string }[] = await dataBase.article.findMany({
    where: { draft: false, language },
    select: { category: true },
  });
  return [...new Set(articles.map((item) => item.category))];
}
