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
      const token = request.cookies.token;
      let articles;
      if (!token) {
        articles = await this.dataBase.article.findMany({
          where: { draft: false },
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            author: true,
            category: true,
            language: true,
          },
        });
      } else {
        const adminId = await this.tokenService.verifyToken(token);
        const findAdmin = await this.dataBase.admin.findUnique({
          where: { id: adminId.id },
        });
        articles = await this.dataBase.article.findMany({
          where: findAdmin ? {} : { draft: false },
          select: findAdmin
            ? undefined
            : {
                id: true,
                title: true,
                description: true,
                date: true,
                author: true,
                category: true,
                language: true,
              },
        });
      }
      if (!articles || articles.length === 0) {
        throw new HttpException(NO_ARTICLES_FOUND, HttpStatus.NOT_FOUND);
      }
      return { articles, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        FAILED_TO_RETRIEVE_ARTICLES,
        error,
      );
    }
  }
  async getCategoryArticles(category, response, request) {
    setHead(response);
    try {
      const token = request.cookies.token;
      let articles;
      if (!token) {
        articles = await this.dataBase.article.findMany({
          where: {
            category,
            draft: false,
          },
        });
      } else {
        articles = await this.dataBase.article.findMany({
          where: { category },
        });
      }
      if (articles.length === 0)
        throw new HttpException(NO_ARTICLES_FOUND, HttpStatus.BAD_REQUEST);
      return { articles, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        FAILED_TO_RETRIEVE_ARTICLES,
        error,
      );
    }
  }
  async findArticle(id, response, request) {
    setHead(response);
    try {
      const token = request.cookies.token;
      let article;
      if (!token) {
        article = await this.dataBase.article.findUnique({
          where: {
            id,
            draft: false,
          },
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            author: true,
            category: true,
            language: true,
          },
        });
      } else {
        const adminId = await this.tokenService.verifyToken(token);
        const findAdmin = await this.dataBase.admin.findUnique({
          where: { id: adminId.id },
        });
        article = await this.dataBase.article.findUnique({
          where: findAdmin
            ? { id }
            : {
                id,
                draft: false,
              },
          select: findAdmin
            ? undefined
            : {
                id: true,
                title: true,
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLE, error);
    }
  }
  async addArticle(data, response, request) {
    setHead(response);
    const { title, description, author, category, language } = data;
    const token = request.cookies.token;
    if (!token) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.tokenService.verifyToken(token);
      const findUser = await this.dataBase.admin.findUnique({
        where: { id: user.id },
      });
      if (!findUser || !user) {
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      }
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
      if (!createArticle) {
        throw new InternalServerErrorException(FAILED_TO_CREATE_ARTICLE);
      }
      return { article: createArticle, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
