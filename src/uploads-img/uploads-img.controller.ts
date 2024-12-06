import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import { NOT_FOUND_IMAGE } from '../consts';
import { UploadsImgService } from './uploads-img.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('uploads')
export class UploadsImgController {
  constructor(private readonly uploadsImg: UploadsImgService) {}

  @Get('/:name')
  @HttpCode(HttpStatus.OK)
  async getImage(@Param('name') name: string, @Res() response: Response) {
    const filePath = path.join(process.cwd(), 'uploads', name);
    if (!fs.existsSync(filePath)) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: NOT_FOUND_IMAGE,
      });
    }

    return response.sendFile(filePath);
  }

  @Post()
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
  async postImg(
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) response,
    @Req() request,
  ) {
    const postImg = file ? `uploads/${file.originalname}` : null;
    return this.uploadsImg.postImg(postImg, response, request);
  }
}
