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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AddArticle, EditDto } from './dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  // Админу
  @Get()
  @HttpCode(HttpStatus.OK)
  async get_articles(@Res({ passthrough: true }) response, @Req() request) {
    return this.articleService.getArticles(response, request);
  }
  // На получение статьи по категории
  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  async get_category_articles(
    @Param('category') category,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    return this.articleService.getCategoryArticles(category, response, request);
  }
  // На получение статьи по slug
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async find_article(
    @Param('slug') slug: string,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    return this.articleService.findArticle(slug, response, request);
  }
  // На изменение статьи
  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async edit_article(
    @Body() dto: EditDto,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    let previewImage = dto.preview_image;
    if (file) {
      previewImage = `uploads/${file.originalname}`;
    }

    return this.articleService.editArticle(
      { ...dto, preview_image: previewImage },
      response,
      request,
    );
  }
  // На создание статьи
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async add_article(
    @Body() dto: AddArticle,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    const previewImage = file ? `uploads/${file.originalname}` : null;
    return this.articleService.addArticle(
      { ...dto, preview_image: previewImage },
      response,
      request,
    );
  }
  // На удаление статьи по id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteArticle(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.articleService.deleteArticle(id, response, request);
  }
}
