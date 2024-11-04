import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
@Injectable()
export class ArticlesService {
  constructor(private readonly dataBase: DatabaseService) {}
  async getArticlesAllUsers() {
    return this.dataBase.article.findMany({
      where: {
        draft: false,
      },
    });
  }
  async getArticles() {
    return this.dataBase.article.findMany({});
  }
  async getCategoryArticles(category) {
    return this.dataBase.article.findMany({
      where: {
        category,
        draft: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        author: true,
        category: true,
      },
    });
  }
  async findArticle(id) {
    return this.dataBase.article.findFirst({
      where: {
        id,
      },
    });
  }
  async addArticle(data) {
    const { title, description, author, category } = data;
    return this.dataBase.article.create({
      data: {
        title,
        description,
        date: new Date(),
        author,
        category,
        draft: true,
        language: 'lang_1',
      },
    });
  }
  async editArticle(data) {
    const { title, description, date, author, category, draft, language } =
      data;
    return this.dataBase.article.update({
      where: {
        id: data.id,
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
  }
  async deleteArticle(data) {
    const { id } = data;
    return this.dataBase.article.delete({
      where: {
        id,
      },
    });
  }
}
