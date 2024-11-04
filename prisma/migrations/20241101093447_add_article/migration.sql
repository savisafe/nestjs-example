-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
