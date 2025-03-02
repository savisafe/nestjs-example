import { Module } from '@nestjs/common';
import { UploadsImgController } from './uploads-img.controller';
import { UploadsImgService } from './uploads-img.service';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UploadsImgController],
  providers: [UploadsImgService, DatabaseService, TokenService, JwtService],
})
export class UploadsImgModule {}
