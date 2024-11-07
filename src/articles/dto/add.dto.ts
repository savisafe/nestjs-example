import { TAuthor, TCategory, TLanguage } from './types';
import { IsNotEmpty } from 'class-validator';

export class AddArticle {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  author: TAuthor;
  @IsNotEmpty()
  category: TCategory;
  @IsNotEmpty()
  language: TLanguage;
  @IsNotEmpty()
  preview_image: string;
}
