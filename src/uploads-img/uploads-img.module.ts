import { Module } from '@nestjs/common';
import { UploadsImgController } from './uploads-img.controller';

@Module({
  controllers: [UploadsImgController],
})
export class UploadsImgModule {}
