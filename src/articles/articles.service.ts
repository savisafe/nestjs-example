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
      return articles;
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
    return articles;
  }
  async findArticle(id) {
    const article = await this.dataBase.article.findFirst({
      where: {
        id,
      },
    });
    if (!article)
      throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.BAD_REQUEST);
    return article;
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
      const createArticle = await this.dataBase.article.create({
        data: {
          title,
          description,
          date: new Date(),
          author,
          category,
          draft: true,
          language,
        },
      });
      if (!createArticle || !findUser) return YOU_DONT_OPPORTUNITY;
      return createArticle;
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
      if (!token) return YOU_DONT_OPPORTUNITY;
      const user = await this.tokenService.verifyToken(token);
      const findUser = await this.dataBase.admin.findUnique({
        where: { id: user.id },
      });
      const findArticle = await this.dataBase.article.findUnique({
        where: {
          id: data.id,
        },
      });
      if (!findArticle || !findUser) return NO_ARTICLE_FOUND;
      return this.dataBase.article.update({
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
      return this.dataBase.article.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLE, error);
    }
  }
}
