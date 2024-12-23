/*
  Warnings:

  - The values [how_to,privacy,anonymity,whox_vpn_news,releases] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('HowTo', 'Privacy', 'Anonymity', 'WhoxVpnNews', 'Releases');
ALTER TABLE "Article" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
