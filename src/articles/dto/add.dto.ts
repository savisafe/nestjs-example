import { TAuthor, TCategory, TLanguage } from './types';

export class AddArticle {
  title: string;
  slug: string;
  description: string;
  author: TAuthor;
  category: TCategory;
  language: TLanguage;
}
