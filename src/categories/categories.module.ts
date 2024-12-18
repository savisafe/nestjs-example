import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseService } from '../database';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, DatabaseService],
})
export class CategoriesModule {}
