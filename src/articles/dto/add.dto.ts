import { TAuthor, TCategory, TLanguage } from './types';

export class AddArticle {
  title: string;
  description: string;
  author: TAuthor;
  category: TCategory;
  language: TLanguage;
}
