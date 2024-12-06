import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import { FAILED_TO_CATEGORIES, NO_CATEGORIES } from '../consts';
import { TokenService } from '../token';
import { setHead, setToken } from '../functions';

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
      const token = setToken(request);
      if (!token) {
        categories = await this.dataBase.article.findMany({
          where: { draft: false },
          select: { category: true },
        });
      } else {
        const adminId = await this.tokenService.verifyToken(token);
        const findAdmin = await this.dataBase.admin.findUnique({
          where: {
            id: adminId.id,
          },
        });
        categories = await this.dataBase.article.findMany({
          where: findAdmin ? undefined : { draft: false },
          select: { category: true },
        });
      }
      if (!categories || categories.length === 0)
        throw new HttpException(NO_CATEGORIES, HttpStatus.BAD_REQUEST);
      return {
        categories: [...new Set(categories.map(({ category }) => category))],
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_CATEGORIES, error);
    }
  }
}
