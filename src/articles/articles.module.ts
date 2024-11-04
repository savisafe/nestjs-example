import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { DatabaseService } from '../database';

@Module({
  providers: [ArticlesService, DatabaseService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
