import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { DatabaseService } from '../database';

@Module({
  providers: [LanguageService, DatabaseService],
  controllers: [LanguageController],
})
export class LanguageModule {}
