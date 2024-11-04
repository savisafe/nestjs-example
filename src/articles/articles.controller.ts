import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AddArticle, EditDto } from './dto';

// TODO: убрать admin и обертнуть куками admin
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async get_articles_all_users() {
    return this.articleService.getArticlesAllUsers();
  }
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async get_articles() {
    return this.articleService.getArticles();
  }
  @Get(':category')
  @HttpCode(HttpStatus.OK)
  async get_category_articles(@Param('category') category) {
    return this.articleService.getCategoryArticles(category);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find_article(@Param('id') id: string) {
    return this.articleService.findArticle(id);
  }
  @Put('admin')
  @HttpCode(HttpStatus.OK)
  async edit_article(@Body() dto: EditDto) {
    return this.articleService.editArticle(dto);
  }
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  async add_article(@Body() dto: AddArticle) {
    return this.articleService.addArticle(dto);
  }
  @Delete('admin')
  @HttpCode(HttpStatus.OK)
  async delete_article(@Body() data: { id: string }) {
    return this.articleService.deleteArticle(data);
  }
}
