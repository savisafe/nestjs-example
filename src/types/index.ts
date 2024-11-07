export interface IAdmin {
  id: string;
  login: string;
  password: string;
  name: string;
}

export interface IArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  category: string;
  draft: false;
  language: string;
  preview_image: string;
}
