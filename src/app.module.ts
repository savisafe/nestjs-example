import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ArticlesController,
  ArticlesService,
  ArticlesModule,
} from './articles';
import { DatabaseService } from './database';
import { TokenModule, TokenService } from './token';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from './admin';

@Module({
  controllers: [AppController, ArticlesController],
  providers: [
    AppService,
    ArticlesService,
    DatabaseService,
    TokenService,
    JwtService,
  ],
  imports: [ArticlesModule, TokenModule, AdminModule],
})
export class AppModule {}
