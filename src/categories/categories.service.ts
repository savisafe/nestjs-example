import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import { FAILED_TO_CATEGORIES } from '../consts';
import { TokenService } from '../token';
import { setHead } from '../functions';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async getCategories(response, request) {
    setHead(response);
    try {
      let categories;
      const token = request.cookies.token;
      if (!token) {
        categories = await this.dataBase.article.findMany({
          where: { draft: false },
          select: { category: true },
        });
      } else {
        categories = await this.dataBase.article.findMany({
          select: { category: true },
        });
      }
      if (categories.length === 0)
        return { message: FAILED_TO_CATEGORIES, statusCode: HttpStatus.OK };
      return {
        categories: [...new Set(categories.map(({ category }) => category))],
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(FAILED_TO_CATEGORIES, error);
    }
  }
}
