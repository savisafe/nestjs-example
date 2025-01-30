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
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AddArticle, EditDto } from './dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { IArticle } from '../types';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  // Админу
  @Get()
  @HttpCode(HttpStatus.OK)
  async get_articles(@Req() request: Request) {
    return this.articleService.getArticles(request);
  }
  // На получение статьи по категории
  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  async get_category_articles(
    @Param('category') category: Extract<IArticle, 'category'>,
    @Query('language') language: Extract<IArticle, 'language'>,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.articleService.getCategoryArticles(
      category,
      language,
      page,
      pageSize,
    );
  }
  // На получение статьи по slug
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async find_article(@Param('slug') slug: string, @Req() request: Request) {
    return this.articleService.findArticle(slug, request);
  }

  // На получение статьи по поиску
  @Get('/search/:title')
  @HttpCode(HttpStatus.OK)
  async find_article_for_title(
    @Param('title') title: string,
    @Req() request: Request,
  ) {
    return this.articleService.findArticleForTitle(title, request);
  }

  // На изменение статьи
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: Request, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async edit_article(
    @Param('id') id: string,
    @Body() dto: EditDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    let previewImage = dto.preview_image;
    if (file) {
      previewImage = `uploads/${file.originalname}`;
    }

    return this.articleService.editArticle(
      id,
      { ...dto, preview_image: previewImage },
      request,
    );
  }
  // На создание статьи
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add_article(@Body() dto: AddArticle, @Req() request: Request) {
    return this.articleService.addArticle(dto, request);
  }
  // На удаление статьи по id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteArticle(@Param('id') id: string, @Req() request: Request) {
    return this.articleService.deleteArticle(id, request);
  }
}
