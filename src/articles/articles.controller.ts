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
  Req,
  Res,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AddArticle, EditDto } from './dto';
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async get_articles(@Res({ passthrough: true }) response) {
    return this.articleService.getArticles(response);
  }
  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  async get_category_articles(@Param('category') category) {
    return this.articleService.getCategoryArticles(category);
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find_article(@Param('id') id: string) {
    return this.articleService.findArticle(id);
  }
  @Put()
  @HttpCode(HttpStatus.OK)
  async edit_article(
    @Body() dto: EditDto,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    return this.articleService.editArticle(dto, response, request);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add_article(
    @Body() dto: AddArticle,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    return this.articleService.addArticle(dto, response, request);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete_article(
    @Body() data: { id: string },
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    return this.articleService.deleteArticle(data, response, request);
  }
}
