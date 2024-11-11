export interface IAdmin {
  id: string;
  login: string;
  token: string;
  password: string;
  role: string;
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

export enum Roles {
  Admin = 'Admin',
  User = 'User',
}
