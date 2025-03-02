import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database';
import { TokenModule, TokenService } from './token';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from './admin';
import { UploadsImgModule } from './uploads-img';
import { LanguageController } from './language/language.controller';
import { LanguageModule } from './language/language.module';
import { LanguageService } from './language/language.service';

@Module({
  controllers: [AppController, LanguageController],
  providers: [
    AppService,
    DatabaseService,
    TokenService,
    LanguageService,
    JwtService,
  ],
  imports: [TokenModule, AdminModule, UploadsImgModule, LanguageModule],
})
export class AppModule {}
