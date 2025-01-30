import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import { FAILED_TO_CATEGORIES } from '../consts';
import { getCategoriesFromDatabase } from './services';
import { Article } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly dataBase: DatabaseService) {}

  async getCategories(language: Extract<Article, 'language'>) {
    try {
      const categories = await getCategoriesFromDatabase(
        language,
        this.dataBase,
      );
      return {
        categories,
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
