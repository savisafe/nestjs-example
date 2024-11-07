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
      const token = request.cookies.token;
      let articles;
      if (!token) {
        articles = await this.dataBase.article.findMany({
          where: { draft: false },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            date: true,
            author: true,
            category: true,
            language: true,
            preview_image: true,
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
                slug: true,
                description: true,
                date: true,
                author: true,
                category: true,
                language: true,
                preview_image: true,
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
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            date: true,
            author: true,
            category: true,
            language: true,
            preview_image: true,
          },
        });
      } else {
        const adminId = await this.tokenService.verifyToken(token);
        const findAdmin = await this.dataBase.admin.findUnique({
          where: { id: adminId.id },
        });
        articles = await this.dataBase.article.findMany({
          where: findAdmin ? { category } : { category, draft: false },
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
  async findArticle(slug, response, request) {
    setHead(response);
    try {
      const token = request.cookies.token;
      let article;
      if (!token) {
        article = await this.dataBase.article.findUnique({
          where: {
            slug,
            draft: false,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            date: true,
            author: true,
            category: true,
            language: true,
            preview_image: true,
          },
        });
      } else {
        const adminId = await this.tokenService.verifyToken(token);
        const findAdmin = await this.dataBase.admin.findUnique({
          where: { id: adminId.id },
        });
        article = await this.dataBase.article.findUnique({
          where: findAdmin
            ? { slug }
            : {
                slug,
                draft: false,
              },
          select: findAdmin
            ? undefined
            : {
                id: true,
                title: true,
                slug: true,
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
    const { title, description, author, category, language, preview_image } =
      data;
    const token = request.cookies.token;

    if (!token) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
    }

    try {
      const adminId = await this.tokenService.verifyToken(token);
      const findAdmin = await this.dataBase.admin.findUnique({
        where: { id: adminId.id },
      });

      if (!findAdmin) {
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      }

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
          preview_image: preview_image || '',
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
    const {
      id,
      title,
      description,
      date,
      author,
      category,
      draft,
      language,
      preview_image,
    } = data;
    try {
      const token = request.cookies.token;
      if (!token)
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      const adminId = await this.tokenService.verifyToken(token);
      const findAdmin = await this.dataBase.admin.findUnique({
        where: { id: adminId.id },
      });
      if (!findAdmin)
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      const findArticle = await this.dataBase.article.findUnique({
        where: {
          id: data.id,
        },
      });
      if (!findArticle)
        throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.BAD_REQUEST);
      const slug = slugify(title, {
        lower: true,
        strict: true,
      });
      const article = await this.dataBase.article.update({
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
          language,
          draft,
          preview_image,
        },
      });
      return {
        article,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_CHANGE_ARTICLE, error);
    }
  }
  async deleteArticle(data, response, request) {
    setHead(response);
    const { id } = data;
    try {
      const token = request.cookies.token;
      if (!token)
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      const adminId = await this.tokenService.verifyToken(token);
      const findAdmin = await this.dataBase.admin.findUnique({
        where: { id: adminId.id },
      });
      if (!findAdmin)
        throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.BAD_REQUEST);
      const findArticle = await this.dataBase.article.findUnique({
        where: {
          id,
        },
      });
      if (!findArticle)
        throw new HttpException(NO_ARTICLE_FOUND, HttpStatus.BAD_REQUEST);

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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(FAILED_TO_DELETE_ARTICLE, error);
    }
  }
}
