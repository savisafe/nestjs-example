import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { JwtService } from '@nestjs/jwt';
import { AdminCheckService } from '../admin-check';

@Module({
  providers: [
    ArticlesService,
    DatabaseService,
    TokenService,
    JwtService,
    AdminCheckService,
  ],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
