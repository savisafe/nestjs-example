import { Module } from '@nestjs/common';
import { UploadsImgController } from './uploads-img.controller';
import { UploadsImgService } from './uploads-img.service';

@Module({
  controllers: [UploadsImgController],
  providers: [UploadsImgService],
})
export class UploadsImgModule {}
