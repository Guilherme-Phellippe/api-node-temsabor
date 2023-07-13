/*
  Warnings:

  - A unique constraint covering the columns `[recipeId]` on the table `link_shortener` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipeId` to the `link_shortener` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "link_shortener" ADD COLUMN     "recipeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "link_shortener_recipeId_key" ON "link_shortener"("recipeId");

-- AddForeignKey
ALTER TABLE "link_shortener" ADD CONSTRAINT "link_shortener_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
