import { DatabaseService } from '../../database';
import { TokenService } from '../../token';
import { IAdmin } from '../../types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FAILED_TO_RETRIEVE_ARTICLE, NO_ARTICLE_FOUND } from '../../consts';

export async function findArticleForDatabase(
  slug: string,
  token: string,
  dataBase: DatabaseService,
  tokenService: TokenService,
) {
  try {
    let article;

    if (!token) {
      article = await dataBase.article.findUnique({
        where: {
          slug,
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
      article = await dataBase.article.findUnique({
        where: findAdmin ? { slug } : { slug, draft: false },
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

    if (!article || article.length === 0) {
      throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.NOT_FOUND);
    }

    return { article, statusCode: HttpStatus.OK };
  } catch (error) {
    throw new HttpException(
      FAILED_TO_RETRIEVE_ARTICLE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
