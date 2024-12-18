import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import { FAILED_TO_CATEGORIES } from '../consts';
import { setHead } from '../functions';

@Injectable()
export class CategoriesService {
  constructor(private readonly dataBase: DatabaseService) {}

  async getCategories(language, response) {
    setHead(response);
    try {
      const categories = await this.dataBase.article.findMany({
        where: { draft: false, language },
        select: { category: true },
      });
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
