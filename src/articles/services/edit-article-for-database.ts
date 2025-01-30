import { DatabaseService } from '../../database';
import { TokenService } from '../../token';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NO_ARTICLE_FOUND, YOU_DONT_OPPORTUNITY } from '../../consts';
import { IAdmin } from '../../types';
import slugify from 'slugify';

export async function editArticleForDatabase(
  id: string,
  data,
  token: string,
  dataBase: DatabaseService,
  tokenService: TokenService,
) {
  try {
    const {
      title,
      description,
      date,
      author,
      category,
      draft,
      language,
      preview_image,
    } = data;

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
    const slug: string = slugify(title || findArticle.title, {
      lower: true,
      strict: true,
    });
    const updateData = await dataBase.article.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        slug,
        date,
        author,
        category,
        draft,
        language,
        preview_image,
      },
    });

    return { updateData };
  } catch (error) {
    throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
