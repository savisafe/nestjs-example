/*
  Warnings:

  - Added the required column `preview_image` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "preview_image" TEXT NOT NULL;
