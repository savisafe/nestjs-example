import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import {
  FAILED_TO_CREATE_ARTICLE,
  FAILED_TO_RETRIEVE_ARTICLE,
  FAILED_TO_RETRIEVE_ARTICLES,
  NO_ARTICLE_FOUND,
  NO_ARTICLES_FOUND,
  YOU_DONT_OPPORTUNITY,
} from '../consts';
import { TokenService } from '../token';
import { setHead } from '../functions';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async getArticles(response, request) {
    setHead(response);
    try {
      let articles;
      const token = request.cookies.token;
      if (!token) {
        articles = await this.dataBase.article.findMany({
          where: {
            draft: false,
          },
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            category: true,
            author: true,
            language: true,
          },
        });
      } else {
        articles = await this.dataBase.article.findMany({});
      }
      if (articles.length === 0)
        return { message: NO_ARTICLES_FOUND, statusCode: HttpStatus.OK };
      return { articles, statusCode: HttpStatus.OK };
    } catch (error) {
      throw new InternalServerErrorException(
        FAILED_TO_RETRIEVE_ARTICLES,
        error,
      );
    }
  }
  async getCategoryArticles(category) {
    const articles = await this.dataBase.article.findMany({
      where: {
        category,
        draft: false,
      },
    });
    if (articles.length === 0)
      throw new HttpException(NO_ARTICLES_FOUND, HttpStatus.BAD_REQUEST);
    return { articles, statusCode: HttpStatus.OK };
  }
  async findArticle(id) {
    const article = await this.dataBase.article.findFirst({
      where: {
        id,
      },
    });
    if (!article)
      throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.BAD_REQUEST);
    return { article, statusCode: HttpStatus.OK };
  }
  async addArticle(data, response, request) {
    setHead(response);
    const { title, description, author, category, language } = data;
    const token = request.cookies.token;
    if (!token)
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
    try {
      const user = await this.tokenService.verifyToken(token);
      const findUser = await this.dataBase.admin.findUnique({
        where: { id: user.id },
      });
      const slug = slugify(title, {
        lower: true,
        strict: true,
      });
      const createArticle = await this.dataBase.article.create({
        data: {
          title,
          slug: slug,
          description,
          date: new Date(),
          author,
          category,
          draft: true,
          language,
        },
      });
      if (!createArticle || !findUser) return YOU_DONT_OPPORTUNITY;
      return { article: createArticle, statusCode: HttpStatus.OK };
    } catch (error) {
      throw new InternalServerErrorException(FAILED_TO_CREATE_ARTICLE, error);
    }
  }
  async editArticle(data, response, request) {
    setHead(response);
    const { id, title, description, date, author, category, draft, language } =
      data;
    try {
      const token = request.cookies.token;
      if (!token)
        return {
          message: YOU_DONT_OPPORTUNITY,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      const user = await this.tokenService.verifyToken(token);
      const findUser = await this.dataBase.admin.findUnique({
        where: { id: user.id },
      });
      const findArticle = await this.dataBase.article.findUnique({
        where: {
          id: data.id,
        },
      });
      if (!findArticle || !findUser)
        return {
          message: NO_ARTICLE_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      const article = await this.dataBase.article.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          date,
          author,
          category,
          language,
          draft,
        },
      });
      return {
        article,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLE, error);
    }
  }
  async deleteArticle(data, response, request) {
    setHead(response);
    const { id } = data;
    const token = request.cookies.token;
    if (!token)
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
    try {
      const user = await this.tokenService.verifyToken(token);
      const findUser = await this.dataBase.admin.findUnique({
        where: { id: user.id },
      });
      const findArticle = await this.dataBase.article.findUnique({
        where: {
          id,
        },
      });
      if (!findArticle || !findUser)
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      const article = await this.dataBase.article.delete({
        where: {
          id,
        },
      });
      return {
        article,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLE, error);
    }
  }
}
