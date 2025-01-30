import { DatabaseService } from '../../database';
import { TokenService } from '../../token';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FAILED_TO_CREATE_ARTICLE, YOU_DONT_OPPORTUNITY } from '../../consts';
import { IAdmin } from '../../types';
import slugify from 'slugify';

export async function addArticleForDatabase(
  data,
  token: string | undefined,
  dataBase: DatabaseService,
  tokenService: TokenService,
) {
  try {
    const { title, description, author, category, language, preview_image } =
      data;

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
    const slug: string = slugify(title, {
      lower: true,
      strict: true,
    });
    const createArticle = await dataBase.article.create({
      data: {
        title,
        slug,
        description,
        date: new Date(),
        author,
        category,
        draft: true,
        language,
        preview_image: preview_image || '',
      },
    });

    if (!createArticle) {
      throw new HttpException(
        FAILED_TO_CREATE_ARTICLE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { createArticle };
  } catch (error) {
    throw new HttpException(
      FAILED_TO_CREATE_ARTICLE,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
