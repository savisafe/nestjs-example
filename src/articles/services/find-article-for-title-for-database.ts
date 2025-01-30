import { DatabaseService } from '../../database';
import { TokenService } from '../../token';
import { IAdmin } from '../../types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NO_ARTICLE_FOUND } from '../../consts';

export async function findArticleForTitleForDatabase(
  title: string,
  token: string | undefined,
  dataBase: DatabaseService,
  tokenService: TokenService,
) {
  try {
    let articles;

    if (!token) {
      articles = await dataBase.article.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
          draft: false,
        },
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
      const adminId: { id: Extract<IAdmin, 'id'> } =
        await tokenService.verifyToken(token);
      const findAdmin = await dataBase.admin.findUnique({
        where: { id: adminId.id },
      });
      articles = await dataBase.article.findMany({
        where: findAdmin
          ? {
              title: {
                contains: title,
                mode: 'insensitive',
              },
            }
          : {
              title: {
                contains: title,
                mode: 'insensitive',
              },
              draft: false,
            },
        select: findAdmin
          ? undefined
          : {
              id: true,
              title: true,
              slug: true,
              description: true,
              date: true,
              author: true,
              category: true,
              language: true,
            },
      });
    }

    if (!articles || articles.length === 0) {
      throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.NOT_FOUND);
    }

    return { article: articles, statusCode: HttpStatus.OK };
  } catch (error) {
    throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
