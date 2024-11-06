import { TAuthor, TCategory, TLanguage } from './types';

export class EditDto {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
  author?: TAuthor;
  category?: TCategory;
  language?: TLanguage;
  draft?: boolean;
}
