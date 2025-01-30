import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import {
  FAILED_TO_CHANGE_ARTICLE,
  FAILED_TO_CREATE_ARTICLE,
  FAILED_TO_DELETE_ARTICLE,
  FAILED_TO_RETRIEVE_ARTICLE,
  FAILED_TO_RETRIEVE_ARTICLES,
  NO_ARTICLE_FOUND,
  NO_ARTICLES_FOUND,
  YOU_DONT_OPPORTUNITY,
} from '../consts';
import { TokenService } from '../token';
import { setToken } from '../functions';
import { IArticle } from '../types';
import e from 'express';
import {
  addArticleForDatabase,
  deleteArticleForDatabase,
  editArticleForDatabase,
  findArticleForTitleForDatabase,
  getArticlesFromDatabase,
  getCategoryArticlesFromDatabase,
} from './services';
import { findArticleForDatabase } from './services/find-article-for-database';
import { AddArticle, EditDto } from './dto';
@Injectable()
export class ArticlesService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async getArticles(request: e.Request) {
    try {
      const articles = await getArticlesFromDatabase(
        request,
        this.tokenService,
        this.dataBase,
      );
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
  async getCategoryArticles(
    category: Extract<IArticle, 'category'>,
    language: Extract<IArticle, 'language'>,
    page: number,
    pageSize: number,
  ) {
    try {
      const { articles, totalArticles } = await getCategoryArticlesFromDatabase(
        category,
        language,
        page,
        pageSize,
        this.dataBase,
      );
      if (articles.length === 0) {
        throw new HttpException(NO_ARTICLES_FOUND, HttpStatus.BAD_REQUEST);
      }

      return {
        articles,
        total: totalArticles,
        statusCode: HttpStatus.OK,
      };
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
  async findArticle(slug: string, request: e.Request) {
    try {
      const token = setToken(request);
      const result = await findArticleForDatabase(
        slug,
        token,
        this.dataBase,
        this.tokenService,
      );
      if (!result.article || result.article.length === 0) {
        throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.NOT_FOUND);
      }
      return { article: result.article, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLE, error);
    }
  }
  async findArticleForTitle(title: string, request: e.Request) {
    try {
      const token = setToken(request);
      const result = await findArticleForTitleForDatabase(
        title,
        token,
        this.dataBase,
        this.tokenService,
      );
      if (!result.article || result.article.length === 0) {
        throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.NOT_FOUND);
      }
      return { article: result.article, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_RETRIEVE_ARTICLE, error);
    }
  }
  async addArticle(data: AddArticle, request: e.Request) {
    const token: string = setToken(request);
    if (!token) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
    }
    try {
      const result = await addArticleForDatabase(
        data,
        token,
        this.dataBase,
        this.tokenService,
      );
      if (!result.createArticle) {
        throw new InternalServerErrorException(FAILED_TO_CREATE_ARTICLE);
      }
      return { article: result.createArticle, statusCode: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_CREATE_ARTICLE, error);
    }
  }
  async editArticle(id: string, data: EditDto, request: e.Request) {
    const token: string = setToken(request);
    try {
      const result = await editArticleForDatabase(
        id,
        data,
        token,
        this.dataBase,
        this.tokenService,
      );
      if (!result.updateData) {
        throw new InternalServerErrorException(FAILED_TO_CHANGE_ARTICLE);
      }
      return {
        article: result.updateData,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_CHANGE_ARTICLE, error);
    }
  }
  async deleteArticle(id: string, request: e.Request) {
    const token: string = setToken(request);
    try {
      const result = await deleteArticleForDatabase(
        id,
        token,
        this.dataBase,
        this.tokenService,
      );
      if (!result.deletedArticle) {
        throw new InternalServerErrorException(FAILED_TO_DELETE_ARTICLE);
      }
      return {
        article: result.deletedArticle,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_DELETE_ARTICLE, error);
    }
  }
}
