/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `stories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "stories" ALTER COLUMN "slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "stories_slug_key" ON "stories"("slug");
