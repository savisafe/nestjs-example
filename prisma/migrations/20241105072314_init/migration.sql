-- CreateEnum
CREATE TYPE "Category" AS ENUM ('test_1', 'test_2', 'test_3');

-- CreateEnum
CREATE TYPE "Author" AS ENUM ('author_1', 'author_2', 'author_3');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('lang_1', 'lang_2', 'lang_3');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "author" "Author" NOT NULL,
    "category" "Category" NOT NULL,
    "draft" BOOLEAN NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
