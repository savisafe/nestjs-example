import { setToken } from '../../functions';
import { NO_ARTICLES_FOUND } from '../../consts';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../../database';
import { TokenService } from '../../token';

export async function getArticlesFromDatabase(
  request,
  tokenService: TokenService,
  dataBase: DatabaseService,
) {
  const token = setToken(request);

  let articles;
  if (!token) {
    articles = await dataBase.article.findMany({
      where: { draft: false },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        date: true,
        author: true,
        category: true,
        language: true,
        preview_image: true,
      },
    });
  } else {
    const adminId: { id: string } = await tokenService.verifyToken(token);
    const findAdmin = await dataBase.admin.findUnique({
      where: { id: adminId.id },
    });

    articles = await dataBase.article.findMany({
      where: findAdmin ? {} : { draft: false },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        date: true,
        author: true,
        category: true,
        language: true,
        preview_image: true,
        draft: true,
      },
    });
  }

  if (!articles || articles.length === 0) {
    throw new HttpException(NO_ARTICLES_FOUND, HttpStatus.NOT_FOUND);
  }

  return articles;
}
