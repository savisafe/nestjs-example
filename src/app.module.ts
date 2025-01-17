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
import { CategoriesModule } from './categories';
import { UploadsImgModule } from './uploads-img';
import { LanguageController } from './language/language.controller';
import { LanguageModule } from './language/language.module';
import { LanguageService } from './language/language.service';
import { ExampleModule } from './example/example.module';

@Module({
  controllers: [AppController, ArticlesController, LanguageController],
  providers: [
    AppService,
    ArticlesService,
    DatabaseService,
    TokenService,
    LanguageService,
    JwtService,
  ],
  imports: [
    ArticlesModule,
    TokenModule,
    AdminModule,
    CategoriesModule,
    UploadsImgModule,
    LanguageModule,
    ExampleModule,
  ],
})
export class AppModule {}
