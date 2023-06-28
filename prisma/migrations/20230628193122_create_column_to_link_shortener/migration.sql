/*
  Warnings:

  - A unique constraint covering the columns `[short_link]` on the table `link_shortener` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `short_link` to the `link_shortener` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "link_shortener" ADD COLUMN     "short_link" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "link_shortener_short_link_key" ON "link_shortener"("short_link");
