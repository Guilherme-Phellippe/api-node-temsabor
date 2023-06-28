/*
  Warnings:

  - You are about to drop the column `short_link` on the `link_shortener` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "link_shortener_short_link_key";

-- AlterTable
ALTER TABLE "link_shortener" DROP COLUMN "short_link";
