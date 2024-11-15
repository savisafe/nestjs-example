/*
  Warnings:

  - Added the required column `token` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Admin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "token" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Roles" NOT NULL;
