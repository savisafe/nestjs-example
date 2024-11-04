/*
  Warnings:

  - Changed the type of `author` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Author" AS ENUM ('author_1', 'author_2', 'author_3');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "author",
ADD COLUMN     "author" "Author" NOT NULL;
