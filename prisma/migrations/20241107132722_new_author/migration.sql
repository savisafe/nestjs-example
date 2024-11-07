/*
  Warnings:

  - The values [author_1,author_2,author_3] on the enum `Author` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Author_new" AS ENUM ('Author_1', 'Author_2', 'Author_3');
ALTER TABLE "Article" ALTER COLUMN "author" TYPE "Author_new" USING ("author"::text::"Author_new");
ALTER TYPE "Author" RENAME TO "Author_old";
ALTER TYPE "Author_new" RENAME TO "Author";
DROP TYPE "Author_old";
COMMIT;
