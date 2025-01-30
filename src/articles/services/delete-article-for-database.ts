import { DatabaseService } from '../../database';
import { TokenService } from '../../token';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NO_ARTICLE_FOUND, YOU_DONT_OPPORTUNITY } from '../../consts';
import { IAdmin } from '../../types';

export async function deleteArticleForDatabase(
  id: string,
  token: string | undefined,
  dataBase: DatabaseService,
  tokenService: TokenService,
) {
  try {
    if (!token) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
    }
    const adminId: { id: Extract<IAdmin, 'id'> } =
      await tokenService.verifyToken(token);
    const findAdmin = await dataBase.admin.findUnique({
      where: { id: adminId.id },
    });
    if (!findAdmin) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
    }
    const findArticle = await dataBase.article.findUnique({
      where: { id },
    });
    if (!findArticle) {
      throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.BAD_REQUEST);
    }
    const deletedArticle = await dataBase.article.delete({
      where: { id },
    });
    return { deletedArticle };
  } catch (error) {
    throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
