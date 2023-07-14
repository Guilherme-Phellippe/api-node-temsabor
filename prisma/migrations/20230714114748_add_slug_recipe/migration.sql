/*
  Warnings:

  - You are about to drop the `link_shortener` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "slug" TEXT;

-- DropTable
DROP TABLE "link_shortener";
