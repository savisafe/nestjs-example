import { TAuthor, TCategory, TLanguage } from './types';
import { IsNotEmpty } from 'class-validator';

export class EditDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  slug?: string;
  @IsNotEmpty()
  title?: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  date?: string;
  @IsNotEmpty()
  author?: TAuthor;
  @IsNotEmpty()
  category?: TCategory;
  @IsNotEmpty()
  language?: TLanguage;
  draft?: boolean;
}
